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
