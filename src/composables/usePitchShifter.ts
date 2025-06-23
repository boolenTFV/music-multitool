import { ref, onMounted } from "vue";
import { useAudioContext } from "./useAudioContext";

export const usePitchShifter = () => {
    const audioContext = useAudioContext();
    const pitchShifterNode = ref<AudioWorkletNode | null>(null);
    const wasInitialized = ref(false);
    const initAudioWorklet = async () => {
        try {
            await audioContext.value.audioWorklet.addModule(
                new URL("@/AudioProcessors/PitchShifterProcessor.js", import.meta.url)
            )
            pitchShifterNode.value = new AudioWorkletNode(
                audioContext.value,
                "pitch-shifter-processor",
            );
        } catch (error) {
            console.error('Failed to initialize pitch shifter:', error);
            throw error;
        }
    }
    onMounted(async () => {
        if(wasInitialized.value) return;
        await initAudioWorklet();
        wasInitialized.value = true;
    })
    const shiftPitch = (semitones: number) => {
        if(!pitchShifterNode.value) return console.warn('Pitch shifter node not found');
        const pitchRatio = pitchShifterNode.value.parameters.get("pitchRatio") as AudioParam;
        const offset = 1 - Math.pow(2, semitones/12);
        pitchRatio.setValueAtTime(offset, audioContext.value.currentTime);
    }
    return {
        pitchShifterNode,
        wasInitialized,
        shiftPitch
    }
}