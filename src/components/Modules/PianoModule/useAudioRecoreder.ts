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
        console.log("record");
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
    };

    const stopPlay = () => {
        if (!source.value) return;
        source.value.stop();
        state.value = "default";
    };

    const stop = () => {
        if (state.value === "record") {
            stopRecord();
        } else {
            stopPlay();
        }
    };

    const play = async () => {
        source.value = audioContext.value.createBufferSource();
        if (!audioBuffer.value) return;
        source.value.buffer = audioBuffer.value;
        source.value.connect(destination.value);
        source.value.start();
        source.value.addEventListener("ended", () => {
            if (state.value !== "play") return;
            play();
        });
        state.value = "play";
    };

    return {
        record,
        stopPlay,
        stopRecord,
        stop,
        play,
        clearRecord,
        audioBuffer,
        destination,
        state,
        isRecorded
    };
    
}
