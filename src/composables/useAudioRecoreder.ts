import { useAudioContext } from "@/composables/useAudioContext";
import { computed, onMounted, ref } from "vue";

const mediaRecorder = ref<MediaRecorder>();

export const useAudioRecorder = () => {
    const audioContext = useAudioContext();

    const chunks = ref<Blob[]>([]);
    const isRecording = ref(false);
    const audioBuffer = ref<AudioBuffer>();
    const isRecorded = computed(() => Boolean(audioBuffer.value));
    const pauseTime = ref<number>();
    const startTime = ref<number>(0);

    onMounted(async () => {
        if (!navigator.mediaDevices) {
            console.error("Media devices not supported");
            return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.value = new MediaRecorder(stream);
    });

    const record = () => {
        if (!mediaRecorder.value) return;
        mediaRecorder.value.ondataavailable = (ev: BlobEvent) => {
            chunks.value.push(ev.data);
        };
        mediaRecorder.value.onstop = async () => {
            const superBlob = new Blob(chunks.value);
            const arrayBuffer = await superBlob.arrayBuffer();
            audioContext.value.decodeAudioData(arrayBuffer, (audioBufferInner: AudioBuffer) => {
                audioBuffer.value = audioBufferInner;
            });
        };
        clearRecord();
        mediaRecorder.value.start();
        isRecording.value = true;
    };

    const stopRecord = async () => {
        if (!mediaRecorder.value) return;
        await mediaRecorder.value.stop();
        isRecording.value = false;
    };


    const clearRecord = () => {
        if (!mediaRecorder.value) return;
        chunks.value = [];
        audioBuffer.value = undefined;
        pauseTime.value = undefined;
        startTime.value = 0;
    };

    return {
        record,
        stopRecord,
        clearRecord,
        audioBuffer,
        isRecorded,
        isRecording
    };
    
}
