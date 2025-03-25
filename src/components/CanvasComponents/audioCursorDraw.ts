export const audioCursorDraw = (ctx: CanvasRenderingContext2D, x: number) => {
    if(!ctx) return;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "lightgray";
    ctx.stroke();
}