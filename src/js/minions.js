import * as Utils from "./utils.js";
import V2 from "./v2.js";

export default class MinionController {
    constructor(initialMinionCount) {
        this.minions = [];

        for (let i = 0; i < initialMinionCount; i++) {
            let x = Utils.getRandInt(0, window.innerWidth);
            let y = Utils.getRandInt(0, window.innerHeight);
            this.minions.push(new Minion(new V2(x, y)));
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
        this.velocity = new V2(0, 0);
        this.acceleration = new V2(0, 0);
        this.maxForce = Utils.getRandFloat(0.1, 0.5);
        this.maxSpeed = Utils.getRandInt(2, 6);

        this.radius = 4;

        // Trail
        this.hasTrail = true;
        this.positionHistory = [];
        this.trailCount = 50;
    }

    seek(dt, target) {
        let desired = V2.getSub(target, this.position);
        desired.normalise();
        desired.multiplyScalar(this.maxSpeed);
        let steer = V2.getSub(desired, this.velocity);
        steer.limit(this.maxForce);

        this.applyForce(steer);
    }

    avoid() {
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update(dt, mousePos) {
        this.seek(dt, mousePos);

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.multiplyScalar(0);

        if (this.hasTrail) {
            this.positionHistory.push(this.position.clone());
            if (this.positionHistory.length >= this.trailCount) this.positionHistory.shift();
        }
    }

    draw(context) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = "rgb(150, 150, 150)";
        context.fill();

        if (this.hasTrail) {
            for (let i = 0; i < this.positionHistory.length - 1; i++) {
                const minAlpha = 0;
                const maxAlpha = 0.8;
                const minThick = 1;
                const maxThick = this.radius * 2;

                let a = this.positionHistory[i];
                let b = this.positionHistory[i + 1];
                let prog = i / this.trailCount;
                let alpha = Utils.lerp(minAlpha, maxAlpha, prog);
                let thickness = Utils.lerp(minThick, maxThick, prog);
                let colour = "rgba(100, 100, 100, " + alpha + ")";

                Utils.lineBetween(context, a, b, colour, thickness);
            }
        }
    }
}
