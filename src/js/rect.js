import V2 from "./v2.js";

export default class Rect {
    constructor(centre, width, height) {
        this.centre = centre;
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;
        this.width = width;
        this.height = height;

        this.left = this.centre.x - this.halfWidth;
        this.right = this.centre.x + this.halfWidth;
        this.top = this.centre.y - this.halfHeight;
        this.bottom = this.centre.y + this.halfHeight;
    }

    contains(point) {
        return point.x >= this.left && point.x <= this.right && point.y >= this.top && point.y <= this.bottom;
    }

    intersects(other) {
        return this.left + this.width >= other.left
            && other.left + other.width >= this.left
            && this.top + this.height >= other.top
            && other.top + other.height >= this.top;
    }
}
