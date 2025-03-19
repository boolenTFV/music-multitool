<template>
    <div :class="$style.container">
        <div v-if="isNotSupporeted">Is not supported</div>
        <VerticalList :class="$style.controls" justify="center" align="center" gap="10px">
            <HorizontalList  gap="10px">
                <DefaultButton :disabled="state !== 'default'" @click="record" square title="Record">
                    <RecordIcon :size="24"/>
                </DefaultButton>
                <DefaultButton :disabled="state !== 'record' && state !== 'play'" @click="stop" square title="Stop">
                    <StopIcon :size="24"/>
                </DefaultButton>
            </HorizontalList>
            <HorizontalList gap="10px">
                <DefaultButton :disabled="state !== 'default' || !isRecorded" @click="play" square title="Play">
                    <PlayIcon />
                </DefaultButton>
                <DefaultButton :disabled="state !== 'default' || !isRecorded"  @click="clearRecord" square title="Clear">
                    <ClearIcon :size="24"/>
                </DefaultButton>
            </HorizontalList>
            <DefaultButton :disabled="state !== 'default' || !isRecorded" @click="handleTrimSilence">
                Trim Silence
            </DefaultButton>
        </VerticalList>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref } from 'vue';
import VerticalList from '@/components/VerticalList.vue';
import { CLEAR_EVENT, looperEventTarget, PLAY_EVENT, STOP_EVENT } from '@/eventTargets/looperEventTarget';
import DefaultButton from '@/components/DefaultButton.vue';
import PlayIcon from '@/components/Icons/PlayIcon.vue';
import ClearIcon from '@/components/Icons/ClearIcon.vue';
import StopIcon from '@/components/Icons/StopIcon.vue';
import RecordIcon from '@/components/Icons/RecordIcon.vue';
import HorizontalList from '@/components/HorizontalList.vue';
import { trimSilence } from '@/utils/trimSilence';
import { useAudioRecorder } from '@/components/Modules/PianoModule/useAudioRecoreder';

const isNotSupporeted = ref(false);

const {
    record,
    stop,
    play,
    clearRecord,
    state,
    isRecorded,
    audioBuffer
} = useAudioRecorder();

onMounted(async () => {
    if (!navigator.mediaDevices) {
        isNotSupporeted.value = true;
    }
});

const handleTrimSilence = async () => {
    if (!audioBuffer.value) return;
    const trimmedBuffer = trimSilence(audioBuffer.value);
    audioBuffer.value = trimmedBuffer;
}

looperEventTarget.addEventListener(STOP_EVENT, stop);
looperEventTarget.addEventListener(PLAY_EVENT, () => {
    stop();
    if (isRecorded.value) play();
});
looperEventTarget.addEventListener(CLEAR_EVENT, () => {
    stop();
    if (isRecorded.value) clearRecord();
});
</script>

<style lang="scss" module>
.container {
    padding: 16px;
    border-radius: 8px;
    background-color: var(--block-color);
    aspect-ratio: 1/1;
}
.controls {
    width: 100%;
    height: 100%;
    @media (max-width: 800px) {
        aspect-ratio: auto;
    }
}
</style>