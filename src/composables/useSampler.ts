import { useAudioContext } from "@/composables/useAudioContext";
import { ref, watch } from "vue";
import { useAudioPlayer } from "@/composables/useAudioPlayer";
import { usePitchShifter } from "@/composables/usePitchShifter";

export const useSampler = () => {
    const audioContext = useAudioContext();
    const mode = ref< "classic" | "loop" >("classic");
    const maxGain = ref(1);
    const gainNode = audioContext.value.createGain();
    const {
        pitchShifterNode,
        shiftPitch,
    } = usePitchShifter();
    const {
        destination,
        play: playRecord,
        stop: stopPlayRecord,
        isPlaying,
        source
    } = useAudioPlayer();

    const compressor = audioContext.value.createDynamicsCompressor();
    compressor.threshold.value = -30;
    compressor.knee.value = 10;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.1;
    compressor.release.value = 0.1;


    watch([pitchShifterNode, destination], async () => {
        if(!pitchShifterNode.value) return;
        pitchShifterNode.value.connect(compressor);
        compressor.connect(gainNode);
        gainNode.connect(audioContext.value.destination);
        destination.value = pitchShifterNode.value;
    }, {
        immediate: true
    })

    const play = (audioBuffer: AudioBuffer, semitones: number = 0, attackTimeMs: number = 0.05) => {
        const attackTime = attackTimeMs / 1000;
        shiftPitch(semitones);
        gainNode.gain.cancelScheduledValues(audioContext.value.currentTime);
        gainNode.gain.setTargetAtTime(maxGain.value, audioContext.value.currentTime + attackTime, attackTime/2);
        playRecord(audioBuffer);
        
    }

    const stop = async (releaseTimeMs: number = 0.05) => {
        const releaseTime = releaseTimeMs / 1000;
        gainNode.gain.cancelScheduledValues(audioContext.value.currentTime);
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
        isPlaying,
        mode,
        maxGain
    }
}