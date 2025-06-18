import { ref } from "vue";
import type { Chord } from "../types";
import { useKeys } from "../PianoModule/useKeys";

export const useChords = () => {
    const CHORD_OCTAVE = 5;
    const keys = useKeys();
    const chords = ref<Chord[]>([...generateChords([4,7], (rootKey) => rootKey ), ...generateChords([3,7], (rootKey) => `${rootKey}m`)]);

    function generateChords(notesSchema: number[], buildChordName: (rootKey: string) => string) {
        const firstOctave = keys.value.filter(key => key.octave === CHORD_OCTAVE);
        const firstOctaveIndex = keys.value.findIndex(key => key.octave === CHORD_OCTAVE);
        const defaultKey = firstOctave[0];
        return firstOctave.map((rootNote, index) => ({
            name: buildChordName(rootNote.key),
            tones: [
                rootNote,
                ...notesSchema.map(offset => {
                    const targetIndex = firstOctaveIndex + index + offset;
                    const safeTargetIndex = keys.value.length < targetIndex ? targetIndex : keys.value.length - 1;
                    return keys.value ? keys.value[safeTargetIndex] : defaultKey
                })
            ]
        }));
    }
    return chords;
};