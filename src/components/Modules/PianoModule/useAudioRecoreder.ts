import { useAudioContext } from "@/composables/useAudioContext";
import { computed, onMounted, ref } from "vue";

const mediaRecorder = ref<MediaRecorder>();

export const useAudioRecorder = () => {
    const audioContext = useAudioContext();

    const chunks = ref<Blob[]>([]);
    const state = ref<"record" | "play" | "default">("default");
    const audioBuffer = ref<AudioBuffer>();
    const source = ref<AudioBufferSourceNode>();
    const isRecorded = computed(() => Boolean(audioBuffer.value));
    const destination = ref<AudioNode>(audioContext.value.destination);
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
        state.value = "record";
    };

    const stopRecord = async () => {
        if (!mediaRecorder.value) return;
        mediaRecorder.value.stop();
        state.value = "default";
    };


    const clearRecord = () => {
        if (!mediaRecorder.value) return;
        chunks.value = [];
        audioBuffer.value = undefined;
        pauseTime.value = undefined;
        startTime.value = 0;
    };

    const stopPlay = (when:number = 0) => {
        if (!source.value) return;
        source.value.stop(when);
        state.value = "default";
        pauseTime.value = undefined;
    };

    const pausePlay = async () => {
        stopPlay();
        pauseTime.value = Date.now();
    };

    const play = async () => {
        source.value = audioContext.value.createBufferSource();
        if (!audioBuffer.value) return;
        if(!pauseTime.value) {
            startTime.value = Date.now();
        }
        source.value.buffer = audioBuffer.value;
        source.value.connect(destination.value);
        const duration = audioBuffer.value.duration || 0;
        const offset = pauseTime.value ? (pauseTime.value - startTime.value) / 1000 : 0;
        source.value.start(0, offset % duration);
        state.value = "play";
    };

    return {
        record,
        stopPlay,
        stopRecord,
        stop,
        play,
        clearRecord,
        pausePlay,
        source,
        audioBuffer,
        destination,
        state,
        isRecorded
    };
    
}
