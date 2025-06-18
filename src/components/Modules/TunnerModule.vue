<template>
    <BlockContainer>
        <template #heading>
            Tunner
        </template>
        <div :class="$style.container" ref="container">
                <canvas :class="$style.canvas" :width="containerRect.width" :height="containerRect.height" ref="canvas" />
                <div v-if="tonicNote && tonicNote.note" :class="$style.noteContainer">
                    <div :class="$style.note" >
                        {{ tonicNote.note }}{{ tonicNote.octave }}
                    </div>
                    <div :class="[$style.cents, centsClass(tonicNote.cents)]">
                        {{ tonicNote.cents }}
                    </div>
                </div>
                <div v-else-if="tonicNote && !tonicNote.note">
                    <div :class="$style.noData">
                        Not found!
                    </div>
                </div>
                <div v-else>
                    <DefaultButton @click="initTuner">
                        Start tuning!
                    </DefaultButton>
                </div>
        </div>
    </BlockContainer>
</template>
<script setup lang="ts">
import { coordinatesInvertY } from '@/utils/coordinatesInvertY';
import BlockContainer from '../BlockContainer.vue';
import clearCanvas from '../CanvasComponents/clearCanvas';
import DefaultButton from '../DefaultButton.vue';
import { onUnmounted, ref, useCssModule } from 'vue';
import { useElementRect } from '@/composables/useElementRect';

const style = useCssModule();
const dataArray = ref<Uint8Array>();
const analyser = ref<AnalyserNode>();
const tonicNote = ref<{note: string, octave: number, cents: number}>();
const canvas = ref<HTMLCanvasElement>();
const container = ref<Element>();
const containerRect = useElementRect(container);
let intervalId: ReturnType<typeof setInterval> = 0;
const centsClass = (cents: number) => {
    if(Math.abs(cents) < 10) return style.perfect;
    if(Math.abs(cents) < 20) return style.close;
    return style.tooFar;
}

const audioContext = ref<AudioContext>(new AudioContext());
function initTuner() {
    analyser.value = audioContext.value.createAnalyser();
    analyser.value.fftSize = 4096; 
    const bufferLength = analyser.value.frequencyBinCount;
    dataArray.value = new Uint8Array(bufferLength);
    captureAudio();
}

function getTonicFrequency() {
    if(!analyser.value || !dataArray.value) return;
    analyser.value.getByteFrequencyData(dataArray.value);

    // Find the frequency with the highest amplitude
    let maxAmplitude = 0;
    let tonicFrequency = 0;

    for (let i = 0; i < analyser.value.frequencyBinCount; i++) {
        if (dataArray.value[i] > maxAmplitude) {
            maxAmplitude = dataArray.value[i];
            tonicFrequency = i * (audioContext.value.sampleRate / analyser.value.fftSize);
        }
    }

    return tonicFrequency;}

function frequencyToNote(frequency: number) {
    const C4 = 261.6255653005986;
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",];

    if (frequency === 0) return null;

    const note = 12 * Math.log2((frequency) / C4);
    const noteRounded = Math.round(note);
    const cents = Math.round((note - noteRounded) * 100);
    const noteName = noteNames[noteRounded % 12];
    const octave = Math.floor(noteRounded / 12) + 4;
    return {note: noteName, octave, cents};
}
async function captureAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    if(!analyser.value) return;
    const source = audioContext.value.createMediaStreamSource(stream);
    source.connect(analyser.value);

    intervalId = setInterval(() => {
        draw();
        const tonicFrequency = getTonicFrequency();
        if(!tonicFrequency) return;
        const note = frequencyToNote(tonicFrequency);
        if(note !== null) {
            tonicNote.value = note;
        }
    }, 20);
}
const draw = () => {
    if (!canvas.value) return;
    if(!dataArray.value || !tonicNote.value) return;
    const ctx = canvas.value?.getContext('2d');
    if (!ctx) return;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    clearCanvas(ctx);
    ctx.beginPath();
    ctx.moveTo(-1,height);
    const step = width / dataArray.value.length;
    const max = Math.max(...dataArray.value) || 1;
    dataArray.value.forEach((item, index) => {
        // each 20th
        if(index % 20 === 0) {
            const y = height/max * item;
            const x = step * index;
            if(y > 2) {
                ctx.lineTo(x - 0.5, coordinatesInvertY(y - 2, height));
            }
            ctx.lineTo(x, coordinatesInvertY(y, height));
            if(y > 2) {
                ctx.lineTo(x + 0.5, coordinatesInvertY(y - 2, height));
            }
        }
    })
    if(!tonicNote.value.note) {
        ctx.strokeStyle = "#55555550";
    } else if(tonicNote.value.cents < 0) {
        ctx.strokeStyle = "#ff000050";
    } else {
        ctx.strokeStyle = "#00ff0050";
    }
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineTo(width, height);
    if(!tonicNote.value.note) {
        ctx.fillStyle = "#11111110";
    } else if(tonicNote.value.cents < 0) {
        ctx.fillStyle = "#ff000010";
    } else {
        ctx.fillStyle = "#00ff0010";
    }
    ctx.fill()
}

onUnmounted(() => {
    if(audioContext.value) {
        audioContext.value.close();
    }
    if(intervalId) {
        clearInterval(intervalId);
    }
})

</script>

<style module>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    height: 100%;
    position: relative;
}
.noteContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
.note {
    font-size: 48px;
    font-weight: bold;
    color: var(--color-primary);
}
.cents {
    font-size: 16px;
    color: var(--color-secondary);
}
.noData {
    font-size: 24px;
    color: var(--color-secondary);
}
.tooFar {
    color: var(--color-error);
}
.close {
    color: var(--color-warning);
}
.perfect {
    color: var(--color-success);
}
.canvas {
    position: absolute;
    inset: 0;
}
</style>