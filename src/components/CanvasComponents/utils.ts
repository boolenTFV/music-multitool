export const xToTime = (ctx: CanvasRenderingContext2D, audioBuffer: AudioBuffer, x: number) => {
    if(!ctx) return 0;
    const width = ctx.canvas.width;
    if(!width) return 0;
    const timeStep =  audioBuffer.duration / width;
    return x * timeStep;
}
export const timeToX = (ctx: CanvasRenderingContext2D, audioBuffer: AudioBuffer, time: number) => {
    if(!ctx) return 0;
    const width = ctx.canvas.width;
    if(!width) return 0;
    const timeStep =  width / audioBuffer.duration;
    return time * timeStep;
}