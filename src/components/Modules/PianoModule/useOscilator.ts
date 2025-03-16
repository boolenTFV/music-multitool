import { useAudioContext } from "@/composables/useAudioContext";
import type { ToneKeyData } from "../types";
import { ref } from "vue";

export const useOscilator = () => {
    const audioContext = useAudioContext();
    const oscillator = audioContext.value.createOscillator();
    const gain = audioContext.value.createGain();
    const busy = ref(false);
    const isOn = ref(false);
    const maxVolume = ref(1);
    const initOscillator = () => {
        oscillator.connect(gain);
        gain.connect(audioContext.value.destination);
        oscillator.start();
        gain.gain.value = 0;
    }

    const playNote = (data: ToneKeyData) => {
        if(busy.value) return;
        if(!isOn.value) {
            isOn.value = true;
            initOscillator();
        }
        oscillator.frequency.value = data.frequency;
        gain.gain.setTargetAtTime(maxVolume.value, audioContext.value.currentTime + 0.01, 0.005);
        busy.value = true;
    }
    const stopNote = () => {
        busy.value = false;
        gain.gain.setTargetAtTime(0, audioContext.value.currentTime + 0.01, 0.005);
    }

    return {
        oscillator,
        gain,
        busy,
        isOn,
        maxVolume,
        initOscillator,
        playNote,
        stopNote
    }
}