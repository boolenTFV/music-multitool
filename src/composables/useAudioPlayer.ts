import { useAudioContext } from "@/composables/useAudioContext";
import { ref } from "vue";

export const useAudioPlayer = () => {
    const audioContext = useAudioContext();
    const isPlaing = ref<boolean>(false)
    const source = ref<AudioBufferSourceNode>();
    const destination = ref<AudioNode>(audioContext.value.destination);
    const pauseTime = ref<number>();
    const startTime = ref<number>(0);

    const stop = (when:number = 0) => {
        if (!source.value) return;
        source.value.stop(when);
        isPlaing.value = false;
        pauseTime.value = undefined;
    };

    const pause = async () => {
        stop();
        pauseTime.value = Date.now();
    };

    const play = async (audioBuffer: AudioBuffer) => {
        source.value = audioContext.value.createBufferSource();
        if (!audioBuffer) return;
        if(!pauseTime.value) {
            startTime.value = Date.now();
        }
        source.value.buffer = audioBuffer;
        source.value.connect(destination.value);
        const duration = audioBuffer.duration || 0;
        const offset = pauseTime.value ? (pauseTime.value - startTime.value) / 1000 : 0;
        source.value.start(0, offset % duration);
        isPlaing.value = true;
    };

    return {
        stop,
        play,
        pause,
        source,
        destination,
        isPlaing
    };
    
}
