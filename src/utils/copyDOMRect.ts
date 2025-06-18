export function copyDOMRect(input: DOMRect) {
    return {
        x: input.x,
        y: input.y,
        left: input.left,
        right: input.right,
        top: input.top,
        bottom: input.bottom,
        height: input.height,
        width: input.width,
    };
}