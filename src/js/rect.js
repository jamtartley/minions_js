import V2 from "./v2.js";

export default class Rect {
    constructor(origin, w, h) {
        this.origin = origin;
        this.w = w;
        this.h = h;
    }

    contains(v) {
        return v.x >= this.origin.x
            && v.x <= this.origin.x + this.w
            && v.y >= this.origin.y
            && v.y <= this.origin.y + this.h;
    }

    intersects(other) {
        return this.origin.x <= other.origin.x + other.w
            && this.origin.x + this.w >= other.origin.x
            && this.origin.y <= other.origin.y + other.h
            && this.origin.y + this.h >= other.origin.y;
    }
}
