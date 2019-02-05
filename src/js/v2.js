class V2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getMagnitude() {
        return Math.sqrt(this.getMagnitudeSquared());
    }

    getMagnitudeSquared() {
        return Math.abs(this.x * this.x + this.y * this.y);
    }

    add(other) {
        this.x += other.x;
        this.y += other.y
    }

    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
    }

    multiply(other) {
        this.x *= other.x;
        this.y *= other.y;
    }

    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    divide(other) {
        this.x /= other.x;
        this.y /= other.y;
    }

    divideScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    normalise() {
        let mag = this.getMagnitude();
        this.divideScalar(mag);
    }

    limit(lim) {
        let mag = this.getMagnitude();

        if (mag < lim) return;

        this.normalise();
        this.multiplyScalar(lim);
    }

    getNormalisedClone() {
        let mag = this.getMagnitude();
        return new V2(this.x / mag, this.y / mag);
    }

    clone() {
        return new V2(this.x, this.y);
    }

    getNegatedVector() {
        return new V2(-this.x, -this.y);
    }

    static getSub(a, b) {
        return new V2(a.x - b.x, a.y - b.y);
    }

    static getAdd(a, b) {
        return new V2(a.x + b.x, a.y + b.y);
    }

    static getMult(a, b) {
        return new V2(a.x * b.x, a.y * b.y);
    }

    static getDistance(a, b) {
        return Math.sqrt(V2.getDistanceSquared(a, b));
    }

    static getDistanceSquared(a, b) {
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        return dx * dx + dy * dy;
    }
}

export default V2;
