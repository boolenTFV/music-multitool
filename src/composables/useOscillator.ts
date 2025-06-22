import type { ToneKeyData } from "@/components/Modules/types";
import { ref } from "vue";
import { useGainEnvelope } from "./useGainEnvelope";

export const useOscillator = (audioContext: AudioContext) => {
    const oscillator = audioContext.createOscillator();
    const busy = ref(false);
    const isOn = ref(false);
    const {
        gainNode,
        attack,
        release,
        gain
    } = useGainEnvelope(audioContext);

    const initOscillator = () => {
        oscillator.connect(gainNode);
        oscillator.start();
    }

    const playNote = (data: ToneKeyData, attackTimeMs: number = 0.2) => {
        if(busy.value) return;
        busy.value = true;
        if(!isOn.value) {
            isOn.value = true;
            initOscillator();
        }
        oscillator.frequency.value = data.frequency;
        attack(attackTimeMs);
    }

    const stopNote = (releaseTimeMs: number = 0.5) => {
        busy.value = false;
        release(releaseTimeMs);
    }


    return {
        oscillator,
        gain,
        busy,
        initOscillator,
        playNote,
        stopNote,
        output: gainNode
    }
}