<template>
   
    <div>
        <canvas width="1000" height="100" ref="canvas" @click="handleClick" />
        <HorizontalList gap="10px">
            <DefaultButton @click="playAudio" square title="Play"><PlayIcon /></DefaultButton>
            <DefaultButton @click="stopAudio" square title="Stop"><StopIcon /></DefaultButton>
            <DefaultButton @click="autoCut">Auto Split</DefaultButton>
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
import { timeToX } from './CanvasComponents/utils';
import AudioBufferPrivew from './AudioBufferPrivew.vue';
import { splitAudioBuffersBySilence } from '@/utils/splitAudioBuffersBySilence';
import CloseIcon from './Icons/CloseIcon.vue';

const { play, stop, isPlaing } = useAudioPlayer();

const canvas = ref<HTMLCanvasElement>();
const props = defineProps<{
    audioBuffer?: AudioBuffer;
}>();
const startSelection = ref<number>();
const endSelection = ref<number>();
const { time, isRunning, start: startStopwatch, stop: stopStopwatch, reset: resetStopwatch, onUpdate: onUpdateStopwatch } = useStopwatch();
const audioBuffers = defineModel<AudioBuffer[]>({required: true});

const deleteItemByIndex = (index: number) => {
    audioBuffers.value = audioBuffers.value.filter((_, i) => i !== index);
}
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

const autoCut = () => {
    if(!props.audioBuffer) return;
    audioBuffers.value = splitAudioBuffersBySilence(props.audioBuffer);
}
watch(time, () => {
    if(!isRunning.value || !props.audioBuffer) return;
    if(time.value > props.audioBuffer.duration) {
        stopStopwatch();
    }
});
onMounted(() => {
    draw();
});

</script>
<style module>
.result {
    margin-top: 10px;
    overflow: hidden;
}
</style>
