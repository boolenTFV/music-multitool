<template>
   
    <div :class="$style.container">
        <canvas :class="$style.canvas" :width="width" :height="height" ref="canvas" @click="handleClick" />
        <HorizontalList gap="10px">
            <DefaultButton @click="playAudio "><PlayIcon /></DefaultButton>
            <DefaultButton @click="stopAudio"><StopIcon /></DefaultButton>
            <slot name="controls" />
        </HorizontalList>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import DefaultButton from '@/components/DefaultButton.vue';
import PlayIcon from '@/components/Icons/PlayIcon.vue';
import StopIcon from '@/components/Icons/StopIcon.vue';
import {useAudioPlayer} from "@/composables/useAudioPlayer";
import { useStopwatch } from '@/composables/useStopwatch'; 
import HorizontalList from '@/components/HorizontalList.vue';
import { audioPreviewDraw } from './CanvasComponents/audioPreviewDraw';
import clearCanvas from './CanvasComponents/clearCanvas';
import { centerLineDraw } from './CanvasComponents/centerLineDraw';
import { audioCursorDraw } from './CanvasComponents/audioCursorDraw';
import { timeToX } from './CanvasComponents/utils';

const { play, stop, isPlaing } = useAudioPlayer();

const canvas = ref<HTMLCanvasElement>();
const props = defineProps<{
    audioBuffer?: AudioBuffer;
    width?: number;
    height?: number;
}>();
const { time, isRunning, start: startStopwatch, stop: stopStopwatch, reset: resetStopwatch, onUpdate: onUpdateStopwatch } = useStopwatch();
watch(time, () => {
    if(!isRunning.value || !props.audioBuffer) return;
    if(time.value > props.audioBuffer.duration) {
        stopStopwatch();
    }
});

onUpdateStopwatch(() => {
    if(!props.audioBuffer) return;
    if(time.value > props.audioBuffer?.duration) {
        console.log("stop");
        stopAudio();
        resetStopwatch();
    }
    draw();
});

const playAudio = () => {
    startStopwatch();
    if(!props.audioBuffer) return;
    play(props.audioBuffer, time.value);

}
const stopAudio = () => {
    stopStopwatch();
    stop();
}

const handleClick = (e: MouseEvent) => {
    if(!canvas.value || !props.audioBuffer) return;
    const rect = canvas.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = canvas.value.width;
    const timeStep =  props.audioBuffer.duration / width;
    time.value = x * timeStep;
    draw();
    if(isPlaing.value) {
        stop();
        play(props.audioBuffer, time.value);
    }
}

const draw = () => {
    if (!canvas.value) return;
    const ctx = canvas.value?.getContext('2d');
    if (!ctx) return;
    clearCanvas(ctx);
    ctx.beginPath();
    centerLineDraw(ctx);
    if(!props.audioBuffer) return;
    audioPreviewDraw(ctx, props.audioBuffer);
    audioCursorDraw(ctx, timeToX(ctx, props.audioBuffer, time.value));
}

onMounted(() => {
    draw();
});

</script>
<style lang="scss" module>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border-radius: 5px;
    padding: 5px;
    box-shadow: 0 2px 2px 0 rgba(255, 255, 255, 0.5);
}
.canvas {
	background: linear-gradient(-45deg, #eea552, #3c9de7, #ab23d5, #ccd523);
	background-size: 400% 400%;
	animation: gradient 30s ease infinite;
    border-radius: 5px;
}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
</style>