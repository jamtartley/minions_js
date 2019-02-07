import Rect from "./rect.js";
import V2 from "./v2.js";
import * as Utils from "./utils.js";

const CAPACITY = 4;

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
        if (this.children.length < CAPACITY && this.northWest === null) {
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
        let quarterWidth = this.bounds.halfWidth / 2;
        let quarterHeight = this.bounds.halfHeight / 2;

        let nwRect = new Rect(new V2(this.bounds.left + quarterWidth, this.bounds.top + quarterHeight), this.bounds.halfWidth, this.bounds.halfHeight);
        let neRect = new Rect(new V2(this.bounds.right + quarterWidth, this.bounds.top + quarterHeight), this.bounds.halfWidth, this.bounds.halfHeight);
        let swRect = new Rect(new V2(this.bounds.left + quarterWidth, this.bounds.bottom - quarterHeight), this.bounds.halfWidth, this.bounds.halfHeight);
        let seRect = new Rect(new V2(this.bounds.right - quarterWidth, this.bounds.bottom - quarterHeight), this.bounds.halfWidth, this.bounds.halfHeight);

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

    getInBounds(bounds) {
        let hits = [];

        if (this.bounds.intersects(bounds) === false) return hits;

        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (bounds.contains(child.position)) hits.push(child);
        }

        if (this.northWest === null) return hits;

        hits.concat(this.northWest.getInBounds(bounds));
        hits.concat(this.northEast.getInBounds(bounds));
        hits.concat(this.southWest.getInBounds(bounds));
        hits.concat(this.southWest.getInBounds(bounds));

        return hits;
    }

    draw(context) {
        Utils.lineBetween(context, new V2(this.bounds.left, this.bounds.top), new V2(this.bounds.right, this.bounds.top), "white", 1);
        Utils.lineBetween(context, new V2(this.bounds.right, this.bounds.top), new V2(this.bounds.right, this.bounds.bottom), "white", 1);
        Utils.lineBetween(context, new V2(this.bounds.right, this.bounds.bottom), new V2(this.bounds.left, this.bounds.bottom), "white", 1);
        Utils.lineBetween(context, new V2(this.bounds.left, this.bounds.bottom), new V2(this.bounds.left, this.bounds.top), "white", 1);

        if (this.northWest !== null) this.northWest.draw(context);
        if (this.northEast !== null) this.northEast.draw(context);
        if (this.southWest !== null) this.southWest.draw(context);
        if (this.southEast !== null) this.southEast.draw(context);
    }
}
