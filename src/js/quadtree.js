import Rect from "./rect.js";
import V2 from "./v2.js";
import * as Utils from "./utils.js";

const CAPACITY = 8;
const LINE_COLOUR = "#183547";

export default class QuadTree {
    constructor(bounds) {
        this.bounds = bounds;
        this.children = [];

        this.northWest = null;
        this.northEast = null;
        this.southWest = null;
        this.southEast = null;
    }

    insert(child) {
        if (this.bounds.contains(child.position) === false) return false;
        if (this.children.length <= CAPACITY && this.northWest === null) {
            this.children.push(child);
            return true;
        }

        if (this.northWest === null) this.subdivide();

        if (this.northWest.insert(child)) return true;
        if (this.northEast.insert(child)) return true;
        if (this.southWest.insert(child)) return true;
        if (this.southEast.insert(child)) return true;

        return false;
    }

    subdivide() {
        let x = this.bounds.origin.x;
        let y = this.bounds.origin.y;
        let w = this.bounds.w / 2;
        let h = this.bounds.h / 2;

        let nwRect = new Rect(new V2(x, y), w, h);
        let neRect = new Rect(new V2(x + w, y), w, h);
        let swRect = new Rect(new V2(x + w, y + h), w, h);
        let seRect = new Rect(new V2(x, y + h), w, h);

        this.northWest = new QuadTree(nwRect);
        this.northEast = new QuadTree(neRect);
        this.southWest = new QuadTree(swRect);
        this.southEast = new QuadTree(seRect);
    }

    clear() {
        if (this.northWest !== null) { this.northWest.clear(); this.northWest = null; }
        if (this.northEast !== null) { this.northEast.clear(); this.northEast = null; }
        if (this.southWest !== null) { this.southWest.clear(); this.southWest = null; }
        if (this.southEast !== null) { this.southEast.clear(); this.southEast = null; }

        this.children.length = 0;
    }

    getInBounds(rect, hitsSoFar) {
        if (!hitsSoFar) hitsSoFar = [];
        if (rect.intersects(this.bounds) === false) return hitsSoFar;

        for (let c of this.children) {
            if (rect.contains(c.position)) hitsSoFar.push(c);
        }

        if (this.northWest !== null) {
            this.northWest.getInBounds(rect, hitsSoFar);
            this.northEast.getInBounds(rect, hitsSoFar);
            this.southWest.getInBounds(rect, hitsSoFar);
            this.southEast.getInBounds(rect, hitsSoFar);
        }

        return hitsSoFar;
    }

    draw(context) {
        const thickness = 8;
        Utils.lineBetween(context, new V2(this.bounds.origin.x, this.bounds.origin.y), new V2(this.bounds.origin.x + this.bounds.w, this.bounds.origin.y), LINE_COLOUR, thickness);
        Utils.lineBetween(context, new V2(this.bounds.origin.x + this.bounds.width, this.bounds.origin.y), new V2(this.bounds.origin.x + this.bounds.w, this.bounds.origin.y + this.bounds.h), LINE_COLOUR, thickness);
        Utils.lineBetween(context, new V2(this.bounds.origin.x + this.bounds.w, this.bounds.origin.y + this.bounds.h), new V2(this.bounds.origin.x, this.bounds.origin.y + this.bounds.h), LINE_COLOUR, thickness);
        Utils.lineBetween(context, new V2(this.bounds.origin.x, this.bounds.origin.y + this.bounds.h), new V2(this.bounds.origin.x, this.bounds.origin.y), LINE_COLOUR, thickness);

        if (this.northWest !== null) this.northWest.draw(context);
        if (this.northEast !== null) this.northEast.draw(context);
        if (this.southWest !== null) this.southWest.draw(context);
        if (this.southEast !== null) this.southEast.draw(context);
    }
}
