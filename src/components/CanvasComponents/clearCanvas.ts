const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    if(!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export default clearCanvas;