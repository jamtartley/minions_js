export function isInsideViewport(el) {
    let elem = $(el[0]);
    let win = $(window);
    let viewport = {
        left: win.scrollLeft(),
        top: win.scrollTop()
    };

    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    let bounds = elem.offset();
    bounds.right = bounds.left + elem.outerWidth();
    bounds.bottom = bounds.top + elem.outerHeight();

    return viewport.right >= bounds.left && viewport.left <= bounds.right && viewport.bottom >= bounds.top && viewport.top <= bounds.bottom;
}

export function getRandFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

export function lineBetween(context, a, b, colour, thickness = 1) {
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.strokeStyle = colour;
    context.lineWidth = thickness;
    context.stroke();
}
