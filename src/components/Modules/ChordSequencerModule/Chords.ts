import { ref } from "vue";
import type { Chord } from "..";
import { useKeys } from "../PianoModule/useKeys";

export const useChords = () => {
    const CHORD_OCTAVE = 5;
    const keys = useKeys();
    const chords = ref<Chord[]>([...generateMajorChords(), ...generateMinorChords()]);
    function generateMajorChords() {
        const firstOctave = keys.value.filter(key => key.octave === CHORD_OCTAVE);
        const firstOctaveIndex = keys.value.findIndex(key => key.octave === CHORD_OCTAVE);
        const defaultKey = firstOctave[0];
        return firstOctave.map((key, index) => ({
            name: key.key,
            tones: [
                key,
                keys.value ? keys.value[firstOctaveIndex + index + 4] : defaultKey,
                keys.value ? keys.value[firstOctaveIndex + index + 7] : defaultKey
            ]
        }));
    }
    function generateMinorChords() {
        const firstOctave = keys.value.filter(key => key.octave === CHORD_OCTAVE);
        const firstOctaveIndex = keys.value.findIndex(key => key.octave === CHORD_OCTAVE);
        const defaultKey = firstOctave[0];
        return firstOctave.map((key, index) => ({
            name: `${key.key}m`,
            tones: [
                key,
                keys.value ? keys.value[firstOctaveIndex + index + 3] : defaultKey,
                keys.value ? keys.value[firstOctaveIndex + index + 7] : defaultKey
            ]
        }));
    }
    return chords;
};