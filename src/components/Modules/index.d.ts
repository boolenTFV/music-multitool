
export type ToneKeyData = {
    key: string;
    octave: number;
    frequency: number;
}
export type PianoToneKeyData = ToneKeyData & {
    type: 'white' | 'black';
}
export type Chord = {
    name: string;
    tones: ToneKeyData[];
}