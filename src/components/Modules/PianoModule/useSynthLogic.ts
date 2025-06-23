import { onMounted, reactive, ref, unref, watch } from "vue";
import { useOscillator } from "@/composables/useOscillator";
import type { PianoToneKeyData, ToneKeyData } from "../types";
import { generateOctave } from "./useKeys";
import { useAudioContext } from "@/composables/useAudioContext";
import { callOnce } from "@/composables/callOnce";
import { useGainEnvelope } from "@/composables/useGainEnvelope";


export const useSynthLogic = () => {
    const audioContext = useAudioContext();
    const maxVolume = ref(1);
    const oscillatorType = ref<'sine' | 'square' | 'triangle' | 'sawtooth'>('sine');
    const mixerNode = ref<AudioWorkletNode>();

    const activeKeyTones = reactive<{
        key1: ToneKeyData | null,
        key2: ToneKeyData | null,
        key3: ToneKeyData | null,
    }>({
        key1: null,
        key2: null,
        key3: null,
    })

    const keys = ref<PianoToneKeyData[]>([...generatePianoOctave(3),...generatePianoOctave(4), ...generatePianoOctave(5), ...generatePianoOctave(6)]);
    const { gain: maxVolume1, attack: attack1, release: release1, gainNode: gainNode1 } = useGainEnvelope(unref(audioContext));
    const { gain: maxVolume2, attack: attack2, release: release2, gainNode: gainNode2 } = useGainEnvelope(unref(audioContext));
    const { gain: maxVolume3, attack: attack3, release: release3, gainNode: gainNode3 } = useGainEnvelope(unref(audioContext));

    const { busy: busy1, playNote: playNote1, stopNote: stopNote1, output: output1 } = useOscillator(unref(audioContext));
    const { busy: busy2, playNote: playNote2, stopNote: stopNote2, output: output2 } = useOscillator(unref(audioContext));
    const { busy: busy3, playNote: playNote3, stopNote: stopNote3, output: output3 } = useOscillator(unref(audioContext));

    const initSynth = async () => {
        await callOnce(
            "import-mixer-processor",
            () => audioContext.value.audioWorklet.addModule(new URL("@/AudioProcessors/MixerProcessor.js", import.meta.url))
        );
        mixerNode.value = new AudioWorkletNode(
            audioContext.value,
            "mixer-processor",
        );
        output1.connect(gainNode1);
        output2.connect(gainNode2);
        output3.connect(gainNode3);
        gainNode1.connect(mixerNode.value);
        gainNode2.connect(mixerNode.value);
        gainNode3.connect(mixerNode.value);
        mixerNode.value.connect(audioContext.value.destination);
    }

    onMounted(async () => {
        await initSynth();
    })

    const playKey = (data: ToneKeyData, attackTime: number = 0.2) => {
        if(!busy1.value) {
            activeKeyTones.key1 = data;
            playNote1(data.frequency);
            attack1(attackTime);
            return true;
        } else if(!busy2.value) {
            activeKeyTones.key2 = data;
            playNote2(data.frequency);
            attack2(attackTime);
            return true;
        } else if(!busy3.value) {
            activeKeyTones.key3 = data;
            playNote3(data.frequency );
            attack3(attackTime);
            return true;
        }
        return false;
    }
    const stopKey = (data: ToneKeyData, releaseTime: number = 0.5) => {
        if(data === activeKeyTones.key1) {
            stopNote1();
            release1(releaseTime);
            activeKeyTones.key1 = null;
        } else if(data === activeKeyTones.key2) {
            stopNote2();
            release2(releaseTime);
            activeKeyTones.key2 = null;
        } else if(data === activeKeyTones.key3) {
            stopNote3();
            release3(releaseTime);
            activeKeyTones.key3 = null;
        }
    }

    watch(oscillatorType, () => {
        output1.type = oscillatorType.value;
        output2.type = oscillatorType.value;
        output3.type = oscillatorType.value;
    })
    watch(maxVolume, () => {
        maxVolume1.value = maxVolume.value;
        maxVolume2.value = maxVolume.value;
        maxVolume3.value = maxVolume.value;
    })
    return {
        keys,
        oscillatorType,
        activeKeyTones,
        playKey,
        maxVolume,
        stopKey
    }
}
function generatePianoOctave(octave: number): PianoToneKeyData[] {
    const octaveKeys = generateOctave(octave);
    const keyTypes = ["white", "black", "white", "black", "white", "white", "black", "white", "black", "white", "black", "white"];
    return octaveKeys.map((item, index) => ({...item, type: keyTypes[index]})) as PianoToneKeyData[];
}