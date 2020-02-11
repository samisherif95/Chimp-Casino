const _raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

export default function raf(cb, timeout = 0) {
    setTimeout(() => _raf(cb), timeout);
};