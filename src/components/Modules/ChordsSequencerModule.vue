<template>
    <BlockContainer>
        <template #header>
            Chords Sequencer
        </template>
        <div :class="$style.container">
            <ChordBeat
                v-for="(chord, index) in sequence"
                :key="index"
                :chord="chord"
                :is-active="currentBeat === index"
                @select-chord="onSelectChord(index, $event)"
            />
        </div>
        <div :class="$style.controls">
            <DefaultButton @click="play" squeare>
                <PlayIcon />
            </DefaultButton>
            <DefaultButton @click="stop" squeare>
                <StopIcon />
            </DefaultButton>
            <label :class="$style.label">
                Beats
                <TextInput type="number" v-model="beats" />
            </label>
            <label :class="$style.label">
                Tempo
                <TextInput type="number" v-model="tempo" />
            </label>
            <label :class="$style.label">
                Volume
                <TextInput type="number" v-model="maxVolumeInterface" />
            </label>
        </div>
    </BlockContainer>   
</template>

<script setup lang="ts">
import BlockContainer from '@/components/BlockContainer.vue';
import ChordBeat from './ChordSequencerModule/ChordBeat.vue';
import type { Chord } from './types';
import { ref, watch } from 'vue';
import DefaultButton from '@/components/DefaultButton.vue';
import TextInput from '@/components/TextInput.vue';
import PlayIcon from '@/components/Icons/PlayIcon.vue';
import StopIcon from '@/components/Icons/StopIcon.vue';
import { timeout } from '@/utils/timeout';
import { useSynthLogic } from './PianoModule/useSynthLogic';
import useDelayedWatch from '@/composables/useDelayedWatch';

const { playKey, stopKey, maxVolume } = useSynthLogic();
const currentBeat = ref(0);
const beats = ref(4);
const tempo = ref(120);
let interval: ReturnType<typeof setInterval> | null = null;
const sequence = ref<(Chord | null)[]>(new Array(beats.value).fill(null).map(() => (null)));
const maxVolumeInterface = ref(50);

watch(maxVolumeInterface, () => {
    maxVolume.value = maxVolumeInterface.value / 100;
}, { immediate: true })
watch(beats, () => {
    stop();
    sequence.value = new Array(beats.value).fill(null).map(() => (null));
})
watch(tempo, () => {
    stop();
})
useDelayedWatch(beats, () => {
    const innerValue = Number(beats.value);
    if(Number.isNaN(innerValue)) return;
    if(innerValue > 20) {
        beats.value = 20;
    } else if(innerValue < 1) {
        beats.value = 1;
    }
}, 1000)
const onSelectChord = (index: number, chord: Chord | null) => {
    if (sequence.value[index] === undefined) return;
    sequence.value[index] = chord;
}

const playChord = (chord: Chord) => {
    return chord.tones.map(tone => {
        return playKey(tone);
    }).every(item => item);
}
const stopChord = (chord: Chord) => {
    chord.tones.forEach(tone => {
        stopKey(tone);
    });
}
const playSequence = async (firstBeat: boolean = false) => {
    const oneBeatTime = (60000 / tempo.value);
    for(let i = 0; i < sequence.value.length; i++) {
        currentBeat.value = i;
        if(interval === null && !firstBeat) return;
        const chord = sequence.value[i];
        if(chord === null) {
            await timeout(oneBeatTime);
        } else {
            while(!playChord(chord)) {
                await timeout(5);
                console.log('replay chord');
            }
            await timeout(oneBeatTime - 10);
            stopChord(chord);
            await timeout(10);
        }
    }
}
const play = () => {
    const oneBeatTime = (60000 / tempo.value);
    playSequence(true);
    interval = setInterval(async () => {
        await playSequence();
    }, oneBeatTime * beats.value);

}
const stop = () => {
    currentBeat.value = 0;
    if(interval) {
        clearInterval(interval);
        interval = null;
    }
}
</script>
<style lang="scss" module>
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-auto-rows: 1fr;
    gap: 16px;
    padding: 16px;
    background: var(--block-color);
    border-radius: var(--button-border-radius);
    margin-bottom: 16px;
    @media (max-width: 1200px) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    }
    @media (max-width: 1020px) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
    @media (max-width: 800px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
    @media (max-width: 600px) {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

.controls {
    display: flex;
    gap: 16px;
    align-items: center;
}

.label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: var(--font-color);
    font-size: 14px;
}
</style>    