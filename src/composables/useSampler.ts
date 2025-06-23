import { useAudioContext } from "@/composables/useAudioContext";
import { ref, watch } from "vue";
import { useAudioPlayer } from "@/composables/useAudioPlayer";
import { usePitchShifter } from "@/composables/usePitchShifter";

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

    const compressor = audioContext.value.createDynamicsCompressor();
    compressor.threshold.value = -30;
    compressor.knee.value = 10;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.1;
    compressor.release.value = 0.1;


    watch([pitchShifterNode, destination], async () => {
        if(!pitchShifterNode.value) return;
        pitchShifterNode.value.connect(compressor);
        destination.value = pitchShifterNode.value;
    }, {
        immediate: true
    })

    const play = (audioBuffer: AudioBuffer, semitones: number = 0) => {
        shiftPitch(semitones);
        playRecord(audioBuffer);
        
    }

    const stop = async (timeToStop: number) => {
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
        output: compressor,
    }
}