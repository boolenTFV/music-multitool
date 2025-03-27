import { useAudioContext } from "@/composables/useAudioContext";
import { onMounted, ref, watch } from "vue";
import { useAudioPlayer } from "@/composables/useAudioPlayer";


export const useSampler = () => {
    const audioContext = useAudioContext();
    const pitchShifterNode = ref<AudioWorkletNode>();
    const mode = ref< "classic" | "loop" >("classic");
    const maxGain = ref(1);
    const gainNode = audioContext.value.createGain();
    const {
        destination,
        play: playRecord,
        stop: stopPlayRecord,
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
    const play = (audioBuffer: AudioBuffer, tone: number = 0, attackTimeMs: number = 0.05) => {
        const attackTime = attackTimeMs / 1000;
        if(pitchShifterNode.value) {
            const pitchRatio = pitchShifterNode.value.parameters.get("pitchRatio") as AudioParam;
            const offset = 1 - Math.pow(2, tone/12);
            console.log(offset);
            pitchRatio.setValueAtTime(offset, audioContext.value.currentTime);
        }
        gainNode.gain.setTargetAtTime(maxGain.value, audioContext.value.currentTime + 0.05, attackTime/0.025);
        gainNode.gain.setTargetAtTime(maxGain.value, audioContext.value.currentTime + attackTime, attackTime/2);
        playRecord(audioBuffer);
        
    }

    const stop = async (releaseTimeMs: number = 0.05) => {
        const releaseTime = releaseTimeMs / 1000;
        gainNode.gain.setTargetAtTime(0, audioContext.value.currentTime + releaseTime, releaseTime/2);
        stopPlayRecord(audioContext.value.currentTime + releaseTime);
    }

    watch([mode, source], ([newMode, newSource]) => {
        if(!newSource) return;
        if(newMode === "loop") {
            newSource.loop = true;
        } else {
            newSource.loop = false;
        }
    });

    return {
        play,
        stop,
        isPlaing,
        mode,
        maxGain
    }
}