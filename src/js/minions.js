import * as Utils from "./utils.js";
import QuadTree from "./quadtree.js";
import Rect from "./rect.js";
import V2 from "./v2.js";

export default class MinionController {
    constructor(initialMinionCount) {
        this.minions = [];
        this.bounds = new Rect(new V2(window.innerWidth / 2, window.innerHeight / 2), window.innerWidth, window.innerHeight);
        this.quadtree = new QuadTree(this.bounds);

        for (let i = 0; i < initialMinionCount; i++) {
            let x = Utils.getRandInt(0, window.innerWidth);
            let y = Utils.getRandInt(0, window.innerHeight);
            this.minions.push(new Minion(new V2(x, y)));
        }
    }

    update(dt, mousePos, isMouseDown) {
        this.quadtree.clear();

        for (let m of this.minions) {
            m.update(dt, mousePos, isMouseDown, this.minions);
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
        this.maxForce = Utils.getRandFloat(16, 32);
        this.maxSpeed = Utils.getRandInt(2, 16);

        this.radius = 4;
        this.avoidRange = this.radius * 2;
        this.flockRange = 200 * 200;

        // Trail
        this.hasTrail = true;
        this.positionHistory = [];
        this.trailCount = 10;
    }

    repel(dt, from) {
        const repelForce = 1500;
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

    avoid(dt, others) {
        let sum = new V2(0, 0);
        let count = 0;

        for (let o of others) {
            if (o === this) continue;

            let d = V2.getDistanceSquared(this.position, o.position);

            if (d < this.avoidRange * this.avoidRange) {
                let diff = V2.getSub(this.position, o.position);
                diff.normalise();
                diff.divideScalar(d);
                sum.add(diff);
                count++;
            }
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

    align(dt, others) {
        const affectDist = 100;
        let sum = new V2(0, 0);
        let count = 0;

        for (let o of others) {
            if (o === this) continue;

            if (V2.getDistanceSquared(this.position, o.position) < affectDist * affectDist) {
                sum.add(o.velocity);
                count++;
            }
        }

        if (count > 0) {
            sum.divideScalar(others.length);
            sum.setMag(this.maxSpeed);

            let steer = V2.getSub(sum, this.velocity);
            steer.limit(this.maxForce);
            steer.multiplyScalar(dt);

            return steer;
        } else {
            return new V2(0, 0);
        }
    }

    cohesion(dt, others) {
        const affectDist = 100;
        let sum = new V2(0, 0);
        let count = 0;

        for (let o of others) {
            if (o === this) continue;

            if (V2.getDistanceSquared(this.position, o.position) < affectDist * affectDist) {
                sum.add(o.position);
                count++;
            }
        }

        if (count > 0) {
            sum.divideScalar(count);
            return this.seek(dt, sum);
        } else {
            return new V2(0, 0);
        }
    }

    flock(dt, others) {
        let avoid = this.avoid(dt, others);
        let align = this.align(dt, others);
        let cohesion = this.cohesion(dt, others);

        avoid.multiplyScalar(1.5);
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

    align(dt, others) {
        let sum = new V2(0,0);
        let count = 0;

        for (let o of others) {
            if (o === this) continue;

            if (V2.getDistanceSquared(this.position, o.position) < this.flockRange) {
                sum.add(o.velocity);
                count++;
            }
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

    cohesion(dt, others) {
        let sum = new V2(0, 0);
        let count = 0;

        for (let o of others) {
            if (o === this) continue;

            if (V2.getDistanceSquared(this.position, o.position) < this.flockRange) {
                sum.add(o.position);
                count++;
            }
        }

        if (count > 0) {
            sum.divideScalar(count);
            return this.seek(dt, sum);
        }

        return sum;
    }

    flock(dt, others) {
        let avoid = this.avoid(dt, others);
        let align = this.align(dt, others);
        let cohesion = this.cohesion(dt, others);

        avoid.multiplyScalar(1.5);
        align.multiplyScalar(1);
        cohesion.multiplyScalar(1);

        avoid.add(align);
        avoid.add(cohesion);

        return avoid;
    }

    runBehaviours(dt, mousePos, isMouseDown, others) {
        let seekForce = this.seek(dt, mousePos);
        //let arriveForce = this.arrive(dt, mousePos);
        let avoidForce = this.avoid(dt, others);
        let repelForce = new V2(0, 0);
        let flockForce = this.flock(dt, others);

        if (isMouseDown) repelForce = this.repel(dt, mousePos);

        seekForce.multiplyScalar(1);
        //arriveForce.multiplyScalar(2);
        avoidForce.multiplyScalar(1);
        repelForce.multiplyScalar(2);
        flockForce.multiplyScalar(1.5);

        this.applyForce(seekForce);
        //this.applyForce(arriveForce);
        this.applyForce(avoidForce);
        this.applyForce(repelForce);
        this.applyForce(flockForce);
    }

    update(dt, mousePos, isMouseDown, others) {
        this.runBehaviours(dt, mousePos, isMouseDown, others);

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.multiplyScalar(0);

        this.lockIntoWindow();

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
