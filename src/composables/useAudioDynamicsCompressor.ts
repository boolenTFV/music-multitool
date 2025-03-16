import { ref } from "vue";
import { useAudioContext } from "./useAudioContext";

const audioDynamicsCompressorRef = ref<DynamicsCompressorNode>();
export const useAudioDynamicsCompressor = () => {
    const audioContextRef = useAudioContext()
    audioDynamicsCompressorRef.value = audioContextRef.value.createDynamicsCompressor();
    audioDynamicsCompressorRef.value.threshold.value = -50;
    audioDynamicsCompressorRef.value.knee.value = 40;
    audioDynamicsCompressorRef.value.ratio.value = 12;
    audioDynamicsCompressorRef.value.attack.value = 0;
    audioDynamicsCompressorRef.value.release.value = 0.25;
    audioDynamicsCompressorRef.value.connect(audioContextRef.value.destination);
    return audioDynamicsCompressorRef;
}