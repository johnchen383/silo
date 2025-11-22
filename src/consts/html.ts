export function IsMouseOutsideOf(e: PointerEvent | MouseEvent, el: HTMLElement) {
    const rect = el.getBoundingClientRect();

    if (e.clientX < rect.left || e.clientX > (rect.left + rect.width) || e.clientY < rect.top || e.clientY > (rect.top + rect.height)) {
        return true;
    }

    return false;
}