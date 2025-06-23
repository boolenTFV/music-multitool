import { ref } from "vue";

export const useOscillator = (audioContext: AudioContext) => {
    const oscillator = audioContext.createOscillator();
    const busy = ref(false);
    const isOn = ref(false);

    const initOscillator = () => {
        oscillator.start();
    }

    const playNote = (frequency: number) => {
        if(busy.value) return;
        busy.value = true;
        if(!isOn.value) {
            isOn.value = true;
            initOscillator();
        }
        oscillator.frequency.value = frequency;
    }

    const stopNote = () => {
        busy.value = false;
    }


    return {
        busy,
        initOscillator,
        playNote,
        stopNote,
        output: oscillator
    }
}