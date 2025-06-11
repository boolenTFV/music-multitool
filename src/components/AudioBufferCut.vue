<template>
    <div>
        <div :class="[$style.container, $style.highlightedBlock]" v-if="editedAudioBuffer">
            <canvas
                :class="$style.canvas"
                ref="canvas"
                @mousedown="handelMouseDown"
                @mousemove="handelMouseMove"
                @mouseup="handleMouseUp"
                @touchstart="handelMouseDown"
                @touchmove="handelMouseMove"
                @touchend="handleMouseUp"
                @click="handleClick"
            />  
            <HorizontalList gap="10px">
                <DefaultButton @click="playAudio" square title="Play"><PlayIcon /></DefaultButton>
                <DefaultButton @click="stopAudio" square title="Stop"><StopIcon /></DefaultButton>
                <DefaultButton @click="slice" square title="Slice"><CutIcon /></DefaultButton>
                <DefaultButton @click="editedAudioBuffer = undefined" square title="Close">
                        <CloseIcon />
                    </DefaultButton>
                <DefaultButton @click="autoCut">Auto Split</DefaultButton>
                <slot name="controls" />
            </HorizontalList>
        </div>
        <div :class="$style.result" >
            <template
                v-for="(audioBufferItem, index) in audioBuffers"
                :key="`${audioBufferItem.duration} + ${audioBufferItem.sampleRate}`"
            >
                <div
                    :class="[$style.dropArea, dragOverIndex === index && $style.dropAreaActive]"
                    @dragover.prevent="dragOver(index)"
                    @drop.prevent="dragDrop(index)"
                ></div>
                <AudioBufferPrivew
                    @drop.prevent="dragDrop(index)"
                    @dragover.prevent="dragOver(index)"
                    @dragstart="dragStart(index)"
                    @dragend="dragEnd"
                    :draggable="true"
                    :data-index="index"
                    :audioBuffer="audioBufferItem"
                    :width="audioBufferItem.duration * 50"
                    :height="50"
                >
                    <template #controls>
                        <DefaultButton
                            @click="handleCutButton(audioBufferItem)"
                            title="Edit"
                            square
                        >
                            <EditIcon />
                        </DefaultButton>
                        <DefaultButton @click="deleteItemByIndex(index)" square title="Delete">
                            <DeleteIcon />
                        </DefaultButton>
                    </template>
                </AudioBufferPrivew>
            </template>
            <div
                :class="[$style.dropArea, dragOverIndex === audioBuffers.length && $style.dropAreaActive]"
                @dragover.prevent="dragOver(audioBuffers.length)"
                @drop.prevent="dragDrop(audioBuffers.length)"
            ></div>
            <div :class="[$style.highlightedBlock, $style.empty]">
                <UploaderInput @change="handleUpload" />
                <DefaultButton>
                    <RecordIcon v-if="!isRecording && !isRecorded" @click="record"/>
                    <StopIcon v-else-if="isRecording" @click="stopRecord"/>
                </DefaultButton>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
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
import UploaderInput from './UploaderInput.vue';
import { useAudioContext } from '@/composables/useAudioContext';
import { useAudioRecorder } from '@/composables/useAudioRecoreder';
import RecordIcon from './Icons/RecordIcon.vue';
import EditIcon from './Icons/EditIcon.vue';
import CutIcon from './Icons/CutIcon.vue';
import DeleteIcon from './Icons/DeleteIcon.vue';

const { play, stop, isPlaing, source} = useAudioPlayer();
const {
    record,
    stopRecord,
    clearRecord,
    audioBuffer: recorderAudioBuffer,
    isRecorded,
    isRecording
} =  useAudioRecorder();
const editedAudioBuffer = ref<AudioBuffer>();
const audioContext = useAudioContext();
const canvas = ref<HTMLCanvasElement>();

const startSelection = ref<number>();
const endSelection = ref<number>();
const { time, isRunning, start: startStopwatch, stop: stopStopwatch, onUpdate: onUpdateStopwatch } = useStopwatch();
const audioBuffers = defineModel<AudioBuffer[]>({required: true});
const canvasWidth = ref(0);
const dragItemIndex = ref<number>();
const dragOverIndex = ref<number>();
const deleteItemByIndex = (index: number) => {
    audioBuffers.value = audioBuffers.value.filter((_, i) => i !== index);
}
const handleCutButton = (audioBuffer: AudioBuffer) => {
    editedAudioBuffer.value = audioBuffer;
    setTimeout(() => draw());
}
onUpdateStopwatch(() => draw());
const dragStart = (index: number) => {
    dragItemIndex.value = index;
};
const dragDrop = (index: number) => {
    if(dragItemIndex.value === undefined) return;
    const newAudioBuffers = [...audioBuffers.value];
    const item = newAudioBuffers[dragItemIndex.value];
    newAudioBuffers.splice(dragItemIndex.value, 1);
    newAudioBuffers.splice(index < dragItemIndex.value ? index : index - 1, 0, item);
    audioBuffers.value = [...newAudioBuffers];
    dragItemIndex.value = undefined;
}
const dragOver = (index: number) => {
    dragOverIndex.value = index;
}
const dragEnd = () => {
    dragItemIndex.value = undefined;
    dragOverIndex.value = undefined;
}
const playAudio = () => {
    if(isPlaing.value || isRunning.value) return;
    startStopwatch();
    if(!editedAudioBuffer.value) return;
    reorderSelection();
    const startTimestamp = Date.now();

    if(startSelection.value && endSelection.value) {
        const ctx = canvas.value?.getContext('2d');
        if (!ctx) return;
        const loopStart = xToTime(ctx, editedAudioBuffer.value, startSelection.value);
        time.value = loopStart;
        const newAudioBuffer = sliceAudioBufferByTime(editedAudioBuffer.value, loopStart, xToTime(ctx, editedAudioBuffer.value, endSelection.value));   

        play(newAudioBuffer, time.value - xToTime(ctx, editedAudioBuffer.value, startSelection.value));
        
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
        play(editedAudioBuffer.value, time.value);
        if(source.value) {
            source.value.onended = () => {
                const endTimestamp = Date.now();
                stopStopwatch();
                stop();
                if(editedAudioBuffer.value && (endTimestamp - startTimestamp)/1000 >= editedAudioBuffer.value.duration) {
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

const handleUpload = async (file: File) => {
    if(file) {
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.value.decodeAudioData(arrayBuffer);
        audioBuffers.value = [...audioBuffers.value, audioBuffer];
    }
}



const draw = () => {
    if (!canvas.value) return;
    canvasWidth.value = canvas.value.clientWidth;
    canvas.value.width = canvas.value.clientWidth;
    canvas.value.height = canvas.value.clientHeight;
    const ctx = canvas.value?.getContext('2d');
    if (!ctx) return;
    clearCanvas(ctx);
    ctx.beginPath();
    centerLineDraw(ctx);
    if(!editedAudioBuffer.value) return;
    audioPreviewDraw(ctx, editedAudioBuffer.value);
    audioCursorDraw(ctx, timeToX(ctx, editedAudioBuffer.value, time.value));
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
    if (!ctx || !editedAudioBuffer.value || !startSelection.value || !endSelection.value) return;

    audioBuffers.value.push(
        sliceAudioBufferByTime(
            editedAudioBuffer.value,
            xToTime(ctx, editedAudioBuffer.value, startSelection.value),
            xToTime(ctx, editedAudioBuffer.value, endSelection.value)
        )
    );
}

const autoCut = () => {
    if(!editedAudioBuffer.value) return;
    audioBuffers.value = splitAudioBuffersBySilence(editedAudioBuffer.value);
}

const handleClick = (e: MouseEvent) => {
    if(!canvas.value || !editedAudioBuffer.value) return;
    const rect = canvas.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = canvas.value.width;
    const timeStep =  editedAudioBuffer.value.duration / width;
    time.value = x * timeStep;
    draw();
    if(isPlaing.value) {
        stop();
        play(editedAudioBuffer.value, time.value);
    }
}

const handelMouseDown = (e: MouseEvent | TouchEvent) => {
    if(!canvas.value || !editedAudioBuffer.value) return;
    const rect = canvas.value.getBoundingClientRect()
    const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX
    const x = clientX - rect.left
    startSelection.value = x;
    endSelection.value = 0;
    draw();
}
const handelMouseMove = (e: MouseEvent | TouchEvent) => {
    if(!canvas.value || !editedAudioBuffer.value) return;
    if(!startSelection.value) return;
    if(e instanceof MouseEvent && e.buttons !== 1) return;
    const rect = canvas.value.getBoundingClientRect()
    const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX
    const x = clientX - rect.left
    if(Math.abs(x - startSelection.value) > 10) {
        endSelection.value = x;
        draw();
    }
}

const handleMouseUp = () => {
    if(!canvas.value || !editedAudioBuffer.value) return;
    if(!startSelection.value || !endSelection.value) return;
    const ctx = canvas.value?.getContext('2d');
    if (!ctx) return;
    reorderSelection();
    time.value = xToTime(ctx, editedAudioBuffer.value, startSelection.value);
    draw();
}

watch(time, () => {
    if(!isRunning.value || !editedAudioBuffer.value) return;
    if(time.value > editedAudioBuffer.value.duration) {
        stopStopwatch();
    }
});
watch(recorderAudioBuffer, () => {
    if(recorderAudioBuffer.value) {
        audioBuffers.value = [...audioBuffers.value, recorderAudioBuffer.value];
        clearRecord();
    }
})
watch(() => editedAudioBuffer.value, () => {
    draw();
});

onMounted(() => {
    draw();
    window.addEventListener('resize', draw); // ctx.translate(0.5, 0.5);
});
onUnmounted(() => {
    window.removeEventListener('resize', draw);
});

</script>
<style module>
.highlightedBlock {
    border-radius: 5px;
    padding: 5px;
    box-shadow: 0 2px 2px 0 rgba(255, 255, 255, 0.5);
}
.container {
    max-width: 100%;
    overflow-x: auto;
}
.result {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-width: 100%;
    overflow-x: auto;
    margin-top: 10px;
    padding-bottom: 2px;
}
.dropArea {
    height: 100px;
    width: 10px;
}
.dropAreaActive {
    background-color: rgba(67, 0, 56, 0.5);
    width: 20px;
}

.canvas {
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	animation: gradient 30s ease infinite;
    border-radius: 5px;
    width: 100%;
    height: 100px;
}

.empty {
    display: flex;
    align-items: center;
    gap: 10px;
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
