import MinionController from "./minions.js";
import V2 from "./v2.js";
import * as Utils from "./utils.js";

function init() {
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    window.requestAnimationFrame(update);
    resize();
}

function mouseDown() {
    isMouseDown = true;
}

function mouseUp() {
    isMouseDown = false;
}

function mouseMove(e) {
    mousePos.x = e.x;
    mousePos.y = e.y;
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (canvas.width != prevWidth || canvas.height != prevHeight) {
        minionController = new MinionController(100);
    }
}

function update() {
    dt = (Date.now() - previousFrameTime) / 1000;

    if (Utils.isInsideViewport($("#vis-container"))) {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        resize();
        updateCanvas();
        drawCanvas();

        prevWidth = canvas.width;
        prevHeight = canvas.height;
    }

    previousFrameTime = Date.now();
    window.requestAnimationFrame(update);
}

function updateCanvas() {
    if (dt) minionController.update(dt, mousePos, isMouseDown);
}

function drawCanvas() {
    minionController.draw(context);
}

let canvas = document.getElementById("vis-container");
let context; 
let prevWidth;
let prevHeight;
let dt;
let previousFrameTime;
let minionController;
let mousePos = new V2(0, 0);
let isMouseDown = false;

if (canvas && canvas.getContext) {
    init();
    context = canvas.getContext("2d");
}
