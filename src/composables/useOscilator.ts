import type { ToneKeyData } from "@/components/Modules/types";
import { ref } from "vue";

export const useOscilator = (audioContext: AudioContext) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const busy = ref(false);
    const isOn = ref(false);
    const maxVolume = ref(1);
    const initOscillator = () => {
        oscillator.connect(gain);
        oscillator.start();
        gain.gain.value = 0;
    }

    const playNote = (data: ToneKeyData, attackTimeMs: number = 0.2) => {
        const attackTime = attackTimeMs / 1000;
        if(busy.value) return;
        busy.value = true;
        if(!isOn.value) {
            isOn.value = true;
            initOscillator();
        }
        oscillator.frequency.value = data.frequency;
        gain.gain.cancelScheduledValues(audioContext.currentTime);
        gain.gain.setTargetAtTime(maxVolume.value, audioContext.currentTime + attackTime, attackTime / 2);
    }

    const stopNote = (releaseTimeMs: number = 0.5) => {
        const releaseTime = releaseTimeMs / 1000;
        busy.value = false;
        gain.gain.cancelScheduledValues(audioContext.currentTime);
        gain.gain.setTargetAtTime(0, audioContext.currentTime + releaseTime, releaseTime / 2);
    }


    return {
        oscillator,
        gain,
        busy,
        isOn,
        maxVolume,
        initOscillator,
        playNote,
        stopNote,
        output: gain
    }
}