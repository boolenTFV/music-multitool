<template>
    <BlockContainer>
        <template #heading>Looper</template>
        <div v-if="isNotSupporeted">Is not supported</div>
        <VerticalList align="center">
            <DefaultButton :disabled="state !== 'default'" @click="record" square>
                <RecordIcon :size="24"/>
            </DefaultButton>
            <DefaultButton :disabled="state !== 'record' && state !== 'play'" @click="stop" square>
                <StopIcon :size="24"/>
            </DefaultButton>
            <DefaultButton :disabled="state !== 'default' || !isRecorded" @click="play" square>
                <PlayIcon />
            </DefaultButton>
            <DefaultButton :disabled="state !== 'default' || !isRecorded"  @click="clearRecord" square>
                <ClearIcon :size="24"/>
            </DefaultButton>
        </VerticalList>
    </BlockContainer>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import BlockContainer from '@/components/BlockContainer.vue';
import VerticalList from '@/components/VerticalList.vue';
import { CLEAR_EVENT, looperEventTarget, PLAY_EVENT, STOP_EVENT } from '@/eventTargets/looperEventTarget';
import { useAudioContext } from '@/composables/useAudioContext';
import DefaultButton from '@/components/DefaultButton.vue';
import PlayIcon from '@/components/Icons/PlayIcon.vue';
import ClearIcon from '@/components/Icons/ClearIcon.vue';
import StopIcon from '@/components/Icons/StopIcon.vue';
import RecordIcon from '@/components/Icons/RecordIcon.vue';

const isNotSupporeted = ref(false)
const mediaRecorder = ref<MediaRecorder>()
const audioChunks = ref<BlobPart[]>([])
const state = ref<"record" | "play" | "default">("default")
const audioContext = useAudioContext();
const source = ref<AudioBufferSourceNode>();
const isRecorded = computed(() => audioChunks.value.length > 0)
onMounted(async () => {
    if (!navigator.mediaDevices){
        isNotSupporeted.value = true;
        return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({audio: true}); 
    mediaRecorder.value = new MediaRecorder(stream);  
    mediaRecorder.value.ondataavailable = (ev: BlobEvent) => {
        audioChunks.value.push(ev.data)
    };
})

function record() {
    if(!mediaRecorder.value) return
    clearRecord()
    mediaRecorder.value.start()
    state.value = "record"
}

function stopRecord() {
    if(!mediaRecorder.value) return
    mediaRecorder.value.stop()
    state.value = "default";
}

function clearRecord() {
    if(!mediaRecorder.value) return
    audioChunks.value = []
}


function stopPlay() {
    if(!source.value) return
    source.value.stop()
    state.value = "default";
}
function stop() {
    if(state.value === "record") {
        stopRecord();
    } else {
        stopPlay();
    }
}

async function play() {
    source.value = audioContext.value.createBufferSource();
    const superBlob = new Blob(audioChunks.value);
    const arrayBuffer = await superBlob.arrayBuffer();
    audioContext.value.decodeAudioData(arrayBuffer, (audioBuffer: AudioBuffer) => {
        if(!source.value) return;
        source.value.buffer = audioBuffer;
        source.value.connect(audioContext.value.destination);
        source.value.start()
        source.value.addEventListener("ended", () => {
            if(state.value !== "play") return;
            play();
        })
    });
    state.value = "play";
}
looperEventTarget.addEventListener(STOP_EVENT, stop);
looperEventTarget.addEventListener(PLAY_EVENT, () => {
    stop();
    if(isRecorded.value) play()
});
looperEventTarget.addEventListener(CLEAR_EVENT, () => {
    stop();
    if(isRecorded.value) clearRecord();
});
</script>