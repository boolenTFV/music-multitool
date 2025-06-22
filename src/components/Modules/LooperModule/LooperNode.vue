<template>
    <div :class="$style.container">
        <div v-if="isNotSupporeted">Is not supported</div>
        <VerticalList :class="$style.controls" justify="center" align="center" gap="10px">
            <HorizontalList  gap="10px">
                <DefaultButton :disabled="isRecorded || isPlaying" @click="record" square title="Record">
                    <RecordIcon :size="24"/>
                </DefaultButton>
                <DefaultButton :disabled="!isPlaying && !isRecording" @click="stop" square title="Stop">
                    <StopIcon :size="24"/>
                </DefaultButton>
            </HorizontalList>
            <HorizontalList gap="10px">
                <DefaultButton :disabled="isPlaying || !isRecorded" @click="play" square title="Play">
                    <PlayIcon />
                </DefaultButton>
                <DefaultButton :disabled="isPlaying || isRecording || !isRecorded"  @click="handleClear" square title="Clear">
                    <ClearIcon :size="24"/>
                </DefaultButton>
            </HorizontalList>
            <HorizontalList gap="10px">
                <UploaderInput @change="handleFileChange" ref="fileInput"/>
            </HorizontalList>
            <DefaultButton :disabled="isPlaying || isRecording || !isRecorded" @click="handleTrimSilence">
                Trim Silence
            </DefaultButton>
        </VerticalList>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, watch } from 'vue';
import VerticalList from '@/components/VerticalList.vue';
import { CLEAR_EVENT, looperEventTarget, PLAY_EVENT, STOP_EVENT } from '@/eventTargets/looperEventTarget';
import DefaultButton from '@/components/DefaultButton.vue';
import PlayIcon from '@/components/Icons/PlayIcon.vue';
import ClearIcon from '@/components/Icons/ClearIcon.vue';
import StopIcon from '@/components/Icons/StopIcon.vue';
import RecordIcon from '@/components/Icons/RecordIcon.vue';
import UploaderInput from '@/components/UploaderInput.vue';
import HorizontalList from '@/components/HorizontalList.vue';
import { trimSilence } from '@/utils/trimSilence';
import { useAudioRecorder } from '@/composables/useAudioRecoreder';
import { useAudioPlayer } from '@/composables/useAudioPlayer';
import { useAudioContext } from '@/composables/useAudioContext';
const fileInput = ref<InstanceType<typeof UploaderInput>>();
const isNotSupporeted = ref(false);
const audioContext = useAudioContext();
const {
    record,
    stopRecord,
    clearRecord,
    isRecorded,
    isRecording,
    audioBuffer
} = useAudioRecorder();
const {
    play: playSample,
    stop: stopSample,
    source,
    isPlaying
} = useAudioPlayer()

onMounted(async () => {
    if (!navigator.mediaDevices) {
        isNotSupporeted.value = true;
    }
});

const handleFileChange = (file: File) => {
    if(!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        audioContext.value.decodeAudioData(arrayBuffer, (innerAudioBuffer: AudioBuffer) => {
          audioBuffer.value = innerAudioBuffer;
        });
    }
    reader.readAsArrayBuffer(file);
}
const play = () => {
    if(!audioBuffer.value) return;
    playSample(audioBuffer.value);
}
const stop = () => {
    if (isRecording.value) {
        stopRecord();
    } else if(isPlaying.value) {
        stopSample();
    }
};
const handleClear = () => {
    clearRecord();
    if(!fileInput.value) return;
    fileInput.value.clear();
}
const handleTrimSilence = async () => {
    if (!audioBuffer.value) return;
    const trimmedBuffer = trimSilence(audioBuffer.value);
    audioBuffer.value = trimmedBuffer;
}
watch(source, (newSource) => {
    if(newSource) {
        newSource.loop = true;
    }
});
looperEventTarget.addEventListener(STOP_EVENT, stop);
looperEventTarget.addEventListener(PLAY_EVENT, () => {
    play();
    if (isRecorded.value) play();
});
looperEventTarget.addEventListener(CLEAR_EVENT, () => {
    if (isRecorded.value) handleClear();
    
});
</script>

<style lang="scss" module>
.container {
    padding: 16px;
    border-radius: 8px;
    background-color: var(--block-color);
    aspect-ratio: 3/4;
}
.controls {
    width: 100%;
    height: 100%;
    @media (max-width: 800px) {
        aspect-ratio: auto;
    }
}
.audioBufferPrivew {
    width: 100%;
    height: 100px;
}
</style>