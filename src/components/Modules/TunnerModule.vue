<template>
    <BlockContainer>
        <template #heading>
            Tunner
        </template>
        <div :class="$style.container">
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
import BlockContainer from '../BlockContainer.vue';
import DefaultButton from '../DefaultButton.vue';
import { onUnmounted, ref, useCssModule } from 'vue';

const style = useCssModule();
const dataArray = ref<Uint8Array>();
const analyser = ref<AnalyserNode>();
const tonicNote = ref<{note: string, octave: number, cents: number}>();

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

    setInterval(() => {
        const tonicFrequency = getTonicFrequency();
        if(!tonicFrequency) return;
        const note = frequencyToNote(tonicFrequency);
        if(note !== null) {
            tonicNote.value = note;
        }
    }, 300);
}

onUnmounted(() => {
    if(audioContext.value) {
        audioContext.value.close();
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

</style>