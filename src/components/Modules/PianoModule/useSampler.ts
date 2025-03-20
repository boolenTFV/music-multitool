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
    compressor.threshold.value = 0.5;
    compressor.knee.value = 10;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.1;
    compressor.release.value = 0.1;


    onMounted(async () => {
        await initAudioWorklet();
    })

    const play = (i: number = 6) => {
        if(pitchShifterNode.value) {
            const pitchRatio = pitchShifterNode.value.parameters.get("pitchRatio") as AudioParam;
            const offset = Math.pow(2, ((12 - i)/12));
            const ratioNormalized = (offset - 1);
            pitchRatio.setValueAtTime(ratioNormalized, audioContext.value.currentTime);
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