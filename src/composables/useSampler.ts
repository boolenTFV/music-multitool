import { useAudioContext } from "@/composables/useAudioContext";
import { onMounted, ref, watch } from "vue";
import { useAudioRecorder } from "@/composables/useAudioRecoreder";
import { useAudioPlayer } from "@/composables/useAudioPlayer";
import { splitAudioBuffersBySilence } from "@/utils/splitAudioBuffersBySilence";
import { trimSilence } from "@/utils/trimSilence";


export const useSampler = () => {
    const audioContext = useAudioContext();
    const pitchShifterNode = ref<AudioWorkletNode>();
    const mode = ref<"classic" | "continous" | "splited">("classic");
    const splitedSamples = ref<AudioBuffer[]>();
    const maxGain = ref(1);
    const gainNode = audioContext.value.createGain();
    const {
        stopRecord,
        isRecorded,
        isRecording,
        clearRecord,
        record,
        audioBuffer
    } = useAudioRecorder();
    const {
        destination,
        play: playRecord,
        stop: stopPlayRecord,
        pause: pausePlayRecord,
        isPlaing,
        source
    } = useAudioPlayer();

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

    watch(mode, () => {
        console.log(mode.value);
    })
    watch([audioBuffer, mode], () => {
        if(mode.value === "splited" && audioBuffer.value) {
            splitedSamples.value = splitAudioBuffersBySilence(trimSilence(audioBuffer.value));
        }
    })
    const play = (i: number = 6, attackTimeMs: number = 0.05) => {
        if(!audioBuffer.value) return;
        const attackTime = attackTimeMs / 1000;
        if(pitchShifterNode.value) {
            const pitchRatio = pitchShifterNode.value.parameters.get("pitchRatio") as AudioParam;
            const offset = Math.pow(2, ((12 - i)/12));
            const ratioNormalized = (offset - 1);
            pitchRatio.setValueAtTime(ratioNormalized, audioContext.value.currentTime);
        }
        if(mode.value === "continous") {
            gainNode.gain.setTargetAtTime(maxGain.value, audioContext.value.currentTime + 0.05, attackTime/0.025);
        }
        if(mode.value === "classic" || mode.value === "splited") {
            gainNode.gain.setTargetAtTime(maxGain.value, audioContext.value.currentTime + attackTime, attackTime/2);
        }
        if(mode.value === "splited" && splitedSamples.value) {
            const currentSample = splitedSamples.value[i % splitedSamples.value?.length];
            console.log(i, splitedSamples.value.length, i % splitedSamples.value?.length, currentSample);
            playRecord(currentSample);
        } else {
            playRecord(audioBuffer.value);
        }
        
    }

    const stop = async (releaseTimeMs: number = 0.05) => {
        const releaseTime = releaseTimeMs / 1000;
        if(mode.value === "continous") {
            gainNode.gain.setTargetAtTime(0, audioContext.value.currentTime + 0.05, releaseTime/0.025);
            pausePlayRecord();
        } else {
            gainNode.gain.setTargetAtTime(0, audioContext.value.currentTime + releaseTime, releaseTime/2);
            stopPlayRecord(audioContext.value.currentTime + releaseTime);
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
        clearRecord,
        stopRecord,
        audioBuffer,
        isRecording,
        isPlaing,
        isRecorded,
        mode,
        maxGain
    }
}