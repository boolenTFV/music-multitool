<template>
    <canvas ref="canvas" />
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
// import {useAudioPlayer} from "@/composables/useAudioPlayer";

// const { playerAudioBuffer, play } = useAudioPlayer();

const canvas = ref<HTMLCanvasElement>();
const props = defineProps<{
    audioBuffer?: AudioBuffer;
}>();

const draw = () => {
    const barWidth = 8;
    const barPadding = 2;
    if (!canvas.value) return;
    const ctx = canvas.value?.getContext('2d');
    if (!ctx) return;
    const width = canvas.value?.width;
    const height = canvas.value?.height;
    if (!width || !height) return;
    const amp = height / 2; // Amplitude scaling
    ctx.clearRect(0, 0, width, height);
    drawCenterLine(ctx, amp, width);
    if(!props.audioBuffer) return;
    const channelData = props.audioBuffer.getChannelData(0);
    const step = Math.ceil((channelData.length * barWidth )/ width); // Step size for drawing
    
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
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, w, h);
      }

    
}
const drawCenterLine = (ctx: CanvasRenderingContext2D, centerHeight: number, width: number) => {
    if (!ctx) return;
    ctx.moveTo(0, centerHeight);
    ctx.lineTo(width, centerHeight);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "lightgray";
    ctx.stroke();
}
watch(() => props.audioBuffer, () => {
    draw();
});
onMounted(() => {
    draw();
});

</script>

