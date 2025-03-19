import { useAudioContext } from "@/composables/useAudioContext";
import { onMounted, ref } from "vue";
import { useAudioRecorder } from "./useAudioRecoreder";


export const useSampler = () => {
    const audioContext = useAudioContext();
    const pitchShifterNode = ref<AudioWorkletNode>();
    const { destination, play: playRecord, stopPlay, stopRecord, state, isRecorded, clearRecord, record, audioBuffer } = useAudioRecorder();
    const initAudioWorklet = async () => {
        await audioContext.value.audioWorklet.addModule(new URL("@/AudioProcessors/PitchShifterProcessor.js", import.meta.url));
        pitchShifterNode.value = new AudioWorkletNode(
        audioContext.value,
        "pitch-shifter-processor",
        );
        
        pitchShifterNode.value.connect(compressor);
        compressor.connect(audioContext.value.destination);
        destination.value = pitchShifterNode.value;
    };

    const compressor = audioContext.value.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;


    onMounted(async () => {
        await initAudioWorklet();
    })

    const play = (i: number = 6, keysCount: number = 48) => {
        if(pitchShifterNode.value) {
            const pitchRatio = pitchShifterNode.value.parameters.get("pitchRatio") as AudioParam;
            pitchRatio.value = ((keysCount - i) * 2/keysCount) - 1;
        }
        
        playRecord();
    }
    const stop = () => {
        stopPlay()
    }

    return {
        play,
        record,
        stop,
        stopPlay,
        clearRecord,
        stopRecord,
        audioBuffer,
        state,
        isRecorded
    }
}