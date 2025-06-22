import { useAudioContext } from "@/composables/useAudioContext";
import { ref, watch } from "vue";
import { useAudioPlayer } from "@/composables/useAudioPlayer";
import { usePitchShifter } from "@/composables/usePitchShifter";
import { useGainEnvelope } from "./useGainEnvelope";

export const useSampler = () => {
    const audioContext = useAudioContext();
    const mode = ref< "classic" | "loop" >("classic");
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
    const {
        gainNode,
        attack,
        release,
        gain,
    } = useGainEnvelope();

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

    const play = (audioBuffer: AudioBuffer, semitones: number = 0, attackTimeMs: number = 50) => {
        shiftPitch(semitones);
        attack(attackTimeMs);
        playRecord(audioBuffer);
        
    }

    const stop = async (releaseTimeMs: number = 50) => {
        const timeToStop = release(releaseTimeMs)
        stopPlayRecord(timeToStop);
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
        gain
    }
}