import * as Utils from "./utils.js";
import QuadTree from "./quadtree.js";
import Rect from "./rect.js";
import V2 from "./v2.js";

export default class MinionController {
    constructor(initialMinionCount) {
        this.minions = [];
        this.quadtree = new QuadTree(new Rect(new V2(0, 0), window.innerWidth, window.innerHeight));

        for (let i = 0; i < initialMinionCount; i++) {
            let x = Utils.getRandInt(0, window.innerWidth);
            let y = Utils.getRandInt(0, window.innerHeight);
            this.minions.push(new Minion(new V2(x, y)));
        }
    }

    update(dt, mousePos, isMouseDown) {
        this.quadtree.clear();

        for (let m of this.minions) {
            m.update(dt, mousePos, isMouseDown, this.quadtree);
            this.quadtree.insert(m);
        }
    }

    draw(context) {
        this.quadtree.draw(context);

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
        this.maxForce = Utils.getRandFloat(8, 16);
        this.maxSpeed = Utils.getRandInt(4, 8);

        this.radius = 3;
        this.avoidRange = 25;
        this.flockRange = 200;

        this.trailCount = 4;
        this.positionHistory = [];

        const min = 225;
        const max = 255;
        let r = Utils.getRandInt(min, max);
        let g = Utils.getRandInt(min, max);
        let b = Utils.getRandInt(min, max);
        this.colour = "rgb(" + r + ", " + g + ", " + b + ")";
    }

    repel(dt, from) {
        const repelForce = 1000;
        let dir = V2.getSub(this.position, from);
        let mag = repelForce / (dir.getMagnitudeSquared());

        dir.multiplyScalar(mag);
        dir.multiplyScalar(dt);

        return dir;
    }

    seek(dt, target) {
        let desired = V2.getSub(target, this.position);

        desired.normalise();
        desired.multiplyScalar(this.maxSpeed);
        desired.sub(this.velocity);
        desired.limit(this.maxForce);
        desired.multiplyScalar(dt);

        return desired;
    }

    arrive(dt, target) {
        const stopDist = 0;
        const startSlowdown = 250;
        let desired = V2.getSub(target, this.position);
        let mag = desired.getMagnitude();
        desired.normalise();

        if (mag < startSlowdown) {
            let m = Utils.map(mag, stopDist, startSlowdown, 0, this.maxSpeed);
            desired.multiplyScalar(m);
        } else {
            desired.multiplyScalar(this.maxSpeed);
        }

        desired.sub(this.velocity);
        desired.limit(this.maxForce);
        desired.multiplyScalar(dt);

        return desired;
    }

    avoid(dt, quadtree) {
        let rect = new Rect(new V2(this.position.x - this.avoidRange / 2, this.position.y - this.avoidRange / 2), this.avoidRange, this.avoidRange);
        let others = quadtree.getInBounds(rect);
        let sum = new V2(0, 0);
        let count = 0;

        for (let o of others) {
            if (o === this) continue;

            let diff = V2.getSub(this.position, o.position);
            diff.normalise();
            diff.divideScalar(V2.getDistance(this.position, o.position));
            sum.add(diff);
            count++;
        }

        if (count > 0) {
            sum.divideScalar(count);
            sum.normalise();
            sum.multiplyScalar(this.maxSpeed);
            sum.sub(this.velocity);
            sum.limit(this.maxForce);
            sum.multiplyScalar(dt);
        }

        return sum;
    }

    align(dt, quadtree) {
        let rect = new Rect(new V2(this.position.x - this.flockRange / 2, this.position.y - this.flockRange / 2), this.flockRange, this.flockRange);
        let others = quadtree.getInBounds(rect);
        let sum = new V2(0,0);
        let count = 0;

        for (let o of others) {
            if (o === this) continue;

            sum.add(o.velocity);
            count++;
        }

        if (count > 0) {
            sum.divideScalar(count);
            sum.normalise();
            sum.multiplyScalar(this.maxSpeed);

            let steer = V2.getSub(sum, this.velocity);
            sum.sub(this.velocity);
            sum.limit(this.maxForce);
            sum.multiplyScalar(dt);
        }

        return sum;
    }

    cohesion(dt, quadtree) {
        let rect = new Rect(new V2(this.position.x - this.flockRange / 2, this.position.y - this.flockRange / 2), this.flockRange, this.flockRange);
        let others = quadtree.getInBounds(rect);
        let sum = new V2(0, 0);
        let count = 0;

        for (let o of others) {
            if (o === this) continue;

            sum.add(o.position);
            count++;
        }

        if (count > 0) {
            sum.divideScalar(count);
            return this.seek(dt, sum);
        }

        return sum;
    }

    flock(dt, quadtree) {
        let avoid = this.avoid(dt, quadtree);
        let align = this.align(dt, quadtree);
        let cohesion = this.cohesion(dt, quadtree);

        avoid.multiplyScalar(2);
        align.multiplyScalar(1);
        cohesion.multiplyScalar(1);

        avoid.add(align);
        avoid.add(cohesion);

        return avoid;
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    lockIntoWindow() {
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x *= -1;
        } else if (this.position.x > window.innerWidth) {
            this.position.x = window.innerWidth;
            this.velocity.x *= -1;
        } else if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y *= -1;
        } else if (this.position.y > window.innerHeight) {
            this.position.y = window.innerHeight;
            this.velocity.y *= -1;
        }
    }

    runBehaviours(dt, mousePos, isMouseDown, quadtree) {
        let seekForce = this.seek(dt, mousePos);
        let repelForce = new V2(0, 0);
        let flockForce = this.flock(dt, quadtree);

        if (isMouseDown) repelForce = this.repel(dt, mousePos);

        seekForce.multiplyScalar(1);
        repelForce.multiplyScalar(5);
        flockForce.multiplyScalar(1.5);

        this.applyForce(seekForce);
        this.applyForce(repelForce);
        this.applyForce(flockForce);
    }

    update(dt, mousePos, isMouseDown, quadtree) {
        this.runBehaviours(dt, mousePos, isMouseDown, quadtree);

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.multiplyScalar(0);

        this.lockIntoWindow();

        if (this.trailCount > 0) {
            this.positionHistory.push(this.position.clone());
            if (this.positionHistory.length >= this.trailCount) this.positionHistory.shift();
        }
    }

    draw(context) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.colour;
        context.fill();

        if (this.trailCount > 0) {
            for (let i = 0; i < this.positionHistory.length - 1; i++) {
                const minAlpha = 0;
                const maxAlpha = 0.8;
                const minThick = 1;
                const maxThick = this.radius * 3;

                let a = this.positionHistory[i];
                let b = this.positionHistory[i + 1];
                let thickness = Utils.lerp(minThick, maxThick, i / this.trailCount);

                Utils.lineBetween(context, a, b, this.colour, thickness);
            }
        }
    }
}
