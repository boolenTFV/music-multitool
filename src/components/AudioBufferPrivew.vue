<template>
   
    <div class="flex flex-col items-center justify-center">
        <canvas width="1000" height="100" ref="canvas" @click="handleClick" />
        <HorizontalList gap="10px">
            <DefaultButton @click="playAudio "><PlayIcon /></DefaultButton>
            <DefaultButton @click="stopAudio"><StopIcon /></DefaultButton>
            <div>{{ time }}</div>
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
}>();
const { time, isRunning, start: startStopwatch, stop: stopStopwatch, reset: resetStopwatch, onUpdate: onUpdateStopwatch } = useStopwatch();
const startSelection = ref<{x: number | undefined, y: number | undefined}>({x: undefined, y: undefined});
const endSelection = ref<{x: number | undefined, y: number | undefined}>({x: undefined, y: undefined});
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
    if(!startSelection.value.x || !endSelection.value.x) {
        play(props.audioBuffer, time.value);
        return;
    }
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

