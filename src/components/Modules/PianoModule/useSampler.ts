import { useAudioContext } from "@/composables/useAudioContext";
import { onMounted, ref, watch } from "vue";
import { useAudioRecorder } from "./useAudioRecoreder";


export const useSampler = () => {
    const audioContext = useAudioContext();
    const pitchShifterNode = ref<AudioWorkletNode>();
    
    const mode = ref<"classic" | "continous">("classic");
    const maxGain = ref(1);
    const gainNode = audioContext.value.createGain();
    const { destination, play: playRecord, stopPlay, pausePlay, stopRecord, state, isRecorded, clearRecord, record, audioBuffer, source} = useAudioRecorder();
    const initAudioWorklet = async () => {
        await audioContext.value.audioWorklet.addModule(new URL("@/AudioProcessors/PitchShifterProcessor.js", import.meta.url));
        pitchShifterNode.value = new AudioWorkletNode(
            audioContext.value,
            "pitch-shifter-processor",
        );
        
        pitchShifterNode.value.connect(compressor);
        compressor.connect(gainNode);
        gainNode.connect(audioContext.value.destination);
        destination.value = pitchShifterNode.value;
    };

    const compressor = audioContext.value.createDynamicsCompressor();
    compressor.threshold.value = -30;
    compressor.knee.value = 10;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.1;
    compressor.release.value = 0.1;


    onMounted(async () => {
        await initAudioWorklet();
    })


    const play = (i: number = 6, attackTimeMs: number = 0.05) => {
        const attackTime = attackTimeMs / 1000;
        if(pitchShifterNode.value) {
            const pitchRatio = pitchShifterNode.value.parameters.get("pitchRatio") as AudioParam;
            const offset = Math.pow(2, ((12 - i)/12));
            const ratioNormalized = (offset - 1);
            pitchRatio.setValueAtTime(ratioNormalized, audioContext.value.currentTime);
        }
        if(mode.value === "continous") {
            gainNode.gain.setTargetAtTime(0, audioContext.value.currentTime + 0.05, attackTime/0.025);
        }
        if(mode.value === "classic") {
            gainNode.gain.setTargetAtTime(maxGain.value, audioContext.value.currentTime + attackTime, attackTime/2);
        }
        playRecord();
    }
    const stop = async (releaseTimeMs: number = 0.05) => {
        const releaseTime = releaseTimeMs / 1000;
        if(mode.value === "continous") {
            gainNode.gain.setTargetAtTime(0, audioContext.value.currentTime + 0.05, releaseTime/0.025);
            pausePlay();
        } else {
            gainNode.gain.setTargetAtTime(0, audioContext.value.currentTime + releaseTime, releaseTime/2);
            stopPlay(audioContext.value.currentTime + releaseTime);
        }
    }

    watch([mode, source], ([newMode, newSource]) => {
        if(!newSource) return;
        if(newMode === "continous") {
            newSource.loop = true;
        } else {
            newSource.loop = false;
        }
    });
    return {
        play,
        record,
        stop,
        stopPlay,
        clearRecord,
        stopRecord,
        audioBuffer,
        state,
        isRecorded,
        mode,
        maxGain
    }
}