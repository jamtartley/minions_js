import MinionController from "./minion.js";
import Vector2D from "./vector_2d.js";
import * as Utils from "./utils.js";

function init() {
    canvas.addEventListener("mousemove", mouseMove, false);
    window.requestAnimationFrame(update);
    resize();
}

function mouseMove(e) {
    currentMousePos.x = e.x;
    currentMousePos.y = e.y;
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (canvas.width != prevWidth || canvas.height != prevHeight) {
        minionController = new MinionController(10);
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
    if (dt) minionController.update(dt, currentMousePos);
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
let currentMousePos = new Vector2D(0, 0);

if (canvas && canvas.getContext) {
    init();
    context = canvas.getContext("2d");
}
