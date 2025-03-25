export const selectionDraw = (ctx: CanvasRenderingContext2D, start: number, end: number) => {
    if(!ctx) return;
    ctx.fillStyle = "rgba(170, 105, 255, 0.5)";
    ctx.fillRect(start, 0, end - start, ctx.canvas.height);
}