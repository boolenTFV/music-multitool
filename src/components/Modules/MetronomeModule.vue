<template>
    <BlockContainer>
        <template #heading>Metronome</template>
        <VerticalList :class="$style.container" justify="space-between">
            <label for="">
                Tempo
                <RangeInput v-model="tempoo" :min="30" :max="250"/>
            </label>
            <label for="">
                Volume
                <RangeInput v-model="volume" :min="0" :max="100"/>
            </label>
            <label for="">
                Beats
                <RangeInput v-model="tackts" :min="2" :max="10"/>
            </label>
            <div :class="$style.tackts">
                <div v-for="i in Number(tackts)" :class="[
                    $style.tackt,
                    i === currentTackt && $style.active
                ]" :key="i"></div>
            </div>
            <DefaultButton v-if="state != 'started'" @click="start" square><PlayIcon /></DefaultButton>
            <DefaultButton v-else @click="stop" square><StopIcon :size="24"/></DefaultButton>
        </VerticalList>
    </BlockContainer>
</template>
<script lang="ts" setup>
import { timeout } from '@/utils/timeout';
import { ref, watch } from 'vue';
import RangeInput from '@/components/RangeInput.vue';
import BlockContainer from '@/components/BlockContainer.vue';
import VerticalList from '@/components/VerticalList.vue';
import DefaultButton from '@/components/DefaultButton.vue';
import StopIcon from '@/components/Icons/StopIcon.vue';
import PlayIcon from '@/components/Icons/PlayIcon.vue';
let gainValue = 0.5;

const tackts = ref(4);
const currentTackt = ref(0);
const volume = ref(50);
const audioContext = ref(new AudioContext);
const tempoo = ref(120);
const synthNode = audioContext.value.createOscillator()
const gainNode = audioContext.value.createGain();

synthNode.connect(gainNode);
gainNode.connect(audioContext.value.destination);
synthNode.frequency.value = 65.41 * 2;
gainNode.gain.value = 0;
synthNode.type = "triangle"

const minute = 60000;
let interval: number | null = null;
const state = ref<"created" | "started" | "stoped">("created");

watch(tempoo, () => {
    if(state.value === "started") {
        stop()
        start()
    }
})

watch(volume, () => {
    gainValue = volume.value/100;
})
watch(tackts, () => {
    currentTackt.value = 0;
})
function start() {   
    currentTackt.value = 0;
    if(state.value === "started") return;
    if(state.value === "created") synthNode.start();
    if(interval) {
        stop()
    }
    state.value = "started";
    const intervalTime = minute / tempoo.value;
    bip()
    interval = setInterval(bip, intervalTime);
}
async function bip() {
    currentTackt.value ++;
    if(currentTackt.value >= Number(tackts.value) + 1) {
        currentTackt.value = 1;
    }

    if(currentTackt.value === 1) {
        synthNode.frequency.value = 65.41 * 3;
    } else {
        synthNode.frequency.value = 65.41 * 2;
    }

    gainNode.gain.setTargetAtTime(gainValue, audioContext.value.currentTime + 0.1, 0.05);
    await timeout(100);
    gainNode.gain.setTargetAtTime(0, audioContext.value.currentTime + 0.1, 0.05);
    

}
function stop() {
    state.value = "stoped";
    if(interval) {
        clearInterval(interval);
    }
    gainNode.gain.setTargetAtTime(0, audioContext.value.currentTime + 0.05, 0.025)
}
</script>

<style lang="scss" module>
.container {
    height: 100%;
}
.tackts {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0;
    margin: 8px 0;
    height: 30px;
}

.tackt {
    border-radius: 50%;
    width: 12px;
    height: 12px;
    background: var(--block-color);
    transition: all 0.2s ease;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--button-primary-bg);
        opacity: 0;
        transition: all 0.2s ease;
    }

    &.active {
        width: 16px;
        height: 16px;
        background: var(--button-primary-bg);
        box-shadow: 0 0 12px var(--button-primary-bg);

        &::after {
            opacity: 1;
            width: 8px;
            height: 8px;
            background: var(--button-text-color);
        }
    }
}
</style>