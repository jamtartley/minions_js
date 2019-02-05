import MinionController from "./minion.js";
import * as Utils from "./utils.js";

function init() {
    window.requestAnimationFrame(update);
    resize();
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (canvas.width != prevWidth || canvas.height != prevHeight) {
        minionController = new MinionController(1);
    }
}

function update() {
    dt = Date.now() - previousFrameTime;

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
    if (dt) minionController.update(dt);
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

if (canvas && canvas.getContext) {
    init();
    context = canvas.getContext("2d");
}
