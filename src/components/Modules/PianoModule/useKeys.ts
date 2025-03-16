import { ref } from "vue";
import type { ToneKeyData } from "..";

export const useKeys = () => {
    const keys = ref<ToneKeyData[]>(generateKeys());
    return keys;
}
export function generateKeys(): ToneKeyData[] {
    return [...generateOctave(3),...generateOctave(4), ...generateOctave(5), ...generateOctave(6)];
}
export function generateOctave(octave: number): ToneKeyData[] {
    const keyNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const keys = []
    for(let i = 0; i < 12; i++) {
        const frequency = computeFrequency(octave, i);
        keys.push({key: keyNames[i], octave, frequency});
    }
    return keys as PianoToneKeyData[];
}

function computeFrequency(octave: number, index: number) {
    const c0Freq = 16.35;
    const cOctaveFreq = c0Freq * Math.pow(2, octave);
    const frequency = cOctaveFreq * Math.pow(2, index / 12);
    return frequency;
}

