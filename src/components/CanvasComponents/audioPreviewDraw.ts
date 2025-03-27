export const audioPreviewDraw = (ctx: CanvasRenderingContext2D, audioBuffer: AudioBuffer) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const barWidth = 8;
  const barPadding = 2;
  if (!ctx) return;
  const amp = height / 2;
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  if(!audioBuffer) return;
  const channelData = audioBuffer.getChannelData(0);
  const step = Math.ceil((channelData.length * barWidth )/ width);
  
  for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = channelData[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      const x = i * barWidth;
      const h = Math.max(1, (max - min) * amp);
      const y = amp - h/2;
      const w = barWidth - barPadding;
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
    }

}