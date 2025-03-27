<template>
   
    <div>
        <canvas
            :class="$style.canvas"
            width="1000"
            height="100"
            ref="canvas"
            @mousedown="handelMouseDown"
            @mousemove="handelMouseMove"
            @mouseup="handleMouseUp"
            @click="handleClick"
        />
        <HorizontalList gap="10px">
            <DefaultButton @click="playAudio" square title="Play"><PlayIcon /></DefaultButton>
            <DefaultButton @click="stopAudio" square title="Stop"><StopIcon /></DefaultButton>
            <DefaultButton @click="slice" square title="Slice">↓</DefaultButton>
            <DefaultButton @click="autoCut">Auto Split</DefaultButton>
            <slot name="controls" />
        </HorizontalList>
        <HorizontalList :class="$style.result" gap="10px" v-if="audioBuffers && audioBuffers.length > 0 && audioBuffer">
            <AudioBufferPrivew
                v-for="(audioBufferItem, index) in audioBuffers"
                :key="`${audioBufferItem.duration} + ${audioBufferItem.sampleRate}`"
                :audioBuffer="audioBufferItem"
                :width="audioBufferItem.duration * 1000/ audioBuffer?.duration"
                :height="50"
            >
                <template #controls>
                    <DefaultButton @click="deleteItemByIndex(index)" square title="Delete">
                        <CloseIcon />
                    </DefaultButton>
                </template>
            </AudioBufferPrivew>
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
import { timeToX, xToTime } from './CanvasComponents/utils';
import AudioBufferPrivew from './AudioBufferPrivew.vue';
import { splitAudioBuffersBySilence } from '@/utils/splitAudioBuffersBySilence';
import CloseIcon from './Icons/CloseIcon.vue';
import { selectionDraw } from './CanvasComponents/selectionDraw';
import { sliceAudioBufferByTime } from '@/utils/sliceAudioBufferByTime';

const { play, stop, isPlaing, source} = useAudioPlayer();

const canvas = ref<HTMLCanvasElement>();
const props = defineProps<{
    audioBuffer?: AudioBuffer;
}>();
const startSelection = ref<number>();
const endSelection = ref<number>();
const { time, isRunning, start: startStopwatch, stop: stopStopwatch, onUpdate: onUpdateStopwatch } = useStopwatch();
const audioBuffers = defineModel<AudioBuffer[]>({required: true});

const deleteItemByIndex = (index: number) => {
    audioBuffers.value = audioBuffers.value.filter((_, i) => i !== index);
}

onUpdateStopwatch(() => draw());

const playAudio = () => {
    if(isPlaing.value || isRunning.value) return;
    startStopwatch();
    if(!props.audioBuffer) return;
    reorderSelection();
    const startTimestamp = Date.now();

    if(startSelection.value && endSelection.value) {
        const ctx = canvas.value?.getContext('2d');
        if (!ctx) return;
        const loopStart = xToTime(ctx, props.audioBuffer, startSelection.value);
        time.value = loopStart;
        const newAudioBuffer = sliceAudioBufferByTime(props.audioBuffer, loopStart, xToTime(ctx, props.audioBuffer, endSelection.value));   

        play(newAudioBuffer, time.value - xToTime(ctx, props.audioBuffer, startSelection.value));
        
        if(source.value) {
            source.value.onended = () => {
                const endTimestamp = Date.now();
                stopStopwatch();
                stop();
                if((endTimestamp - startTimestamp)/1000 >= newAudioBuffer.duration) {
                    time.value = loopStart;
                    draw();
                }
            }
        }
        
    } else {
        play(props.audioBuffer, time.value);
        if(source.value) {
            source.value.onended = () => {
                const endTimestamp = Date.now();
                stopStopwatch();
                stop();
                if(props.audioBuffer && (endTimestamp - startTimestamp)/1000 >= props.audioBuffer.duration) {
                    time.value = 0;
                    draw();
                }
            }
        }
    }

}
const stopAudio = () => {
    stopStopwatch();
    stop();
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
    if(startSelection.value && endSelection.value) {
        selectionDraw(ctx, startSelection.value, endSelection.value);
    }
}

const reorderSelection = () => {
    if(!startSelection.value || !endSelection.value) return;
    if(startSelection.value > endSelection.value) {
        [startSelection.value, endSelection.value] = [endSelection.value, startSelection.value];
    }
}

const slice = () => {
    if (!canvas.value) return;
    const ctx = canvas.value?.getContext('2d');
    if (!ctx || !props.audioBuffer || !startSelection.value || !endSelection.value) return;

    audioBuffers.value.push(
        sliceAudioBufferByTime(
            props.audioBuffer,
            xToTime(ctx, props.audioBuffer, startSelection.value),
            xToTime(ctx, props.audioBuffer, endSelection.value)
        )
    );
}

const autoCut = () => {
    if(!props.audioBuffer) return;
    audioBuffers.value = splitAudioBuffersBySilence(props.audioBuffer);
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

const handelMouseDown = (e: MouseEvent) => {
    if(!canvas.value || !props.audioBuffer) return;
    const rect = canvas.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    startSelection.value = x;
    endSelection.value = 0;
    draw();
}
const handelMouseMove = (e: MouseEvent) => {
    if(!canvas.value || !props.audioBuffer) return;
    if(!startSelection.value) return;
    if(e.buttons !== 1) return;
    const rect = canvas.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    if(Math.abs(x - startSelection.value) > 10) {
        endSelection.value = x;
        draw();
    }
}

const handleMouseUp = () => {
    if(!canvas.value || !props.audioBuffer) return;
    if(!startSelection.value || !endSelection.value) return;
    const ctx = canvas.value?.getContext('2d');
    if (!ctx) return;
    reorderSelection();
    time.value = xToTime(ctx, props.audioBuffer, startSelection.value);
    draw();
}



watch(time, () => {
    if(!isRunning.value || !props.audioBuffer) return;
    if(time.value > props.audioBuffer.duration) {
        stopStopwatch();
    }
});
watch(() => props.audioBuffer, () => {
    draw();
});
onMounted(() => {
    draw();
    const ctx = canvas.value?.getContext('2d');
    if (!ctx) return;
        // ctx.translate(0.5, 0.5);
});

</script>
<style module>
.result {
    margin-top: 10px;
    overflow: hidden;
}

.canvas {
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
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
