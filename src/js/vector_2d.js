class Vector2D {
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

    clone() {
        return new Vector2D(this.x, this.y);
    }

    getNegatedVector() {
        return new Vector2D(-this.x, -this.y);
    }

    static getSubtractionVector(a, b) {
        return new Vector2D(a.x - b.x, a.y - b.y);
    }

    static getAdditionVector(a, b) {
        return new Vector2D(a.x + b.x, a.y + b.y);
    }

    static getDistance(a, b) {
        return Math.sqrt(Vector2D.getDistanceSquared(a, b));
    }

    static getDistanceSquared(a, b) {
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        return dx * dx + dy * dy;
    }
}

export default Vector2D;
