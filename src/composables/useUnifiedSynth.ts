import { ref, watch, computed } from "vue";
import { useOscillator } from "@/composables/useOscillator";
import { useSampler } from "@/composables/useSampler";
import { useGainEnvelope } from "@/composables/useGainEnvelope";
import { useAudioContext } from "@/composables/useAudioContext";
import type { ToneKeyData } from "@/components/Modules/types";

export type SynthType = 'synthesizer' | 'sampler';

export const useUnifiedSynth = () => {
    const audioContext = useAudioContext();
    const type = ref<SynthType>('synthesizer');
    
    // Oscillator setup for synthesizer
    const { busy: busy1, playNote: playNote1, stopNote: stopNote1, output: output1 } = useOscillator(audioContext.value);
    const { busy: busy2, playNote: playNote2, stopNote: stopNote2, output: output2 } = useOscillator(audioContext.value);
    const { busy: busy3, playNote: playNote3, stopNote: stopNote3, output: output3 } = useOscillator(audioContext.value);
    
    // Sampler setup for polyphony (3 voices)
    const sampler1 = useSampler();
    const sampler2 = useSampler();
    const sampler3 = useSampler();
    
    // Gain envelopes for each synth voice
    const { gain: gain1, attack: attack1, release: release1, gainNode: gainNode1 } = useGainEnvelope(audioContext.value);
    const { gain: gain2, attack: attack2, release: release2, gainNode: gainNode2 } = useGainEnvelope(audioContext.value);
    const { gain: gain3, attack: attack3, release: release3, gainNode: gainNode3 } = useGainEnvelope(audioContext.value);
    // Gain envelopes for each sampler voice
    const { gain: samplerGain1, attack: samplerAttack1, release: samplerRelease1, gainNode: samplerGainNode1 } = useGainEnvelope(audioContext.value);
    const { gain: samplerGain2, attack: samplerAttack2, release: samplerRelease2, gainNode: samplerGainNode2 } = useGainEnvelope(audioContext.value);
    const { gain: samplerGain3, attack: samplerAttack3, release: samplerRelease3, gainNode: samplerGainNode3 } = useGainEnvelope(audioContext.value);
    
    // Active key tracking
    const activeKeyTones = ref<{
        key1: ToneKeyData | null,
        key2: ToneKeyData | null,
        key3: ToneKeyData | null,
    }>({
        key1: null,
        key2: null,
        key3: null,
    });
    // Active sampler key tracking
    const activeSamplerKeys = ref<{
        key1: ToneKeyData | null,
        key2: ToneKeyData | null,
        key3: ToneKeyData | null,
    }>({
        key1: null,
        key2: null,
        key3: null,
    });
    
    // Audio samples for sampler
    const audioBuffers = ref<AudioBuffer[]>([]);
    
    // Oscillator type for synthesizer
    const oscillatorType = ref<'sine' | 'square' | 'triangle' | 'sawtooth'>('sine');
    
    // Connect oscillators to gain nodes (do this once, not in a watch)
    output1.connect(gainNode1);
    output2.connect(gainNode2);
    output3.connect(gainNode3);
    // Connect samplers to gain nodes (do this once, not in a watch)
    sampler1.output.connect(samplerGainNode1);
    sampler2.output.connect(samplerGainNode2);
    sampler3.output.connect(samplerGainNode3);
    
    // Update oscillator types when changed
    watch(oscillatorType, () => {
        output1.type = oscillatorType.value;
        output2.type = oscillatorType.value;
        output3.type = oscillatorType.value;
    });
    
    // Update gains when changed
    watch([gain1, gain2, gain3, samplerGain1, samplerGain2, samplerGain3], () => {
        // Gains are already reactive through the useGainEnvelope composable
    });
    
    const playKey = (data: ToneKeyData, attackTime: number = 200, semitones: number = 0) => {
        if (type.value === 'synthesizer') {
            return playSynthesizerKey(data, attackTime);
        } else {
            return playSamplerKey(data, attackTime, semitones);
        }
    };
    
    const stopKey = (data: ToneKeyData, releaseTime: number = 500) => {
        if (type.value === 'synthesizer') {
            return stopSynthesizerKey(data, releaseTime);
        } else {
            return stopSamplerKey(data, releaseTime);
        }
    };
    
    // --- Synthesizer Polyphony Logic ---
    const playSynthesizerKey = (data: ToneKeyData, attackTime: number) => {
        if (!busy1.value) {
            activeKeyTones.value.key1 = data;
            playNote1(data.frequency);
            attack1(attackTime);
            return true;
        } else if (!busy2.value) {
            activeKeyTones.value.key2 = data;
            playNote2(data.frequency);
            attack2(attackTime);
            return true;
        } else if (!busy3.value) {
            activeKeyTones.value.key3 = data;
            playNote3(data.frequency);
            attack3(attackTime);
            return true;
        }
        return false;
    };
    
    const stopSynthesizerKey = (data: ToneKeyData, releaseTime: number) => {
        if (data === activeKeyTones.value.key1) {
            stopNote1();
            release1(releaseTime);
            activeKeyTones.value.key1 = null;
        } else if (data === activeKeyTones.value.key2) {
            stopNote2();
            release2(releaseTime);
            activeKeyTones.value.key2 = null;
        } else if (data === activeKeyTones.value.key3) {
            stopNote3();
            release3(releaseTime);
            activeKeyTones.value.key3 = null;
        }
    };
    
    // --- Sampler Polyphony Logic ---
    const playSamplerKey = (data: ToneKeyData, attackTime: number, semitones: number) => {
        if (audioBuffers.value.length === 0) {
            console.warn('No samples available for sampler');
            return false;
        }
        // Find a free sampler slot
        if (!activeSamplerKeys.value.key1) {
            activeSamplerKeys.value.key1 = data;
            samplerAttack1(attackTime);
            sampler1.play(selectSample(data), semitones);
            return true;
        } else if (!activeSamplerKeys.value.key2) {
            activeSamplerKeys.value.key2 = data;
            samplerAttack2(attackTime);
            sampler2.play(selectSample(data), semitones);
            return true;
        } else if (!activeSamplerKeys.value.key3) {
            activeSamplerKeys.value.key3 = data;
            samplerAttack3(attackTime);
            sampler3.play(selectSample(data), semitones);
            return true;
        }
        return false;
    };
    
    const stopSamplerKey = (data: ToneKeyData, releaseTime: number) => {
        if (data === activeSamplerKeys.value.key1) {
            const timeToStop = samplerRelease1(releaseTime);
            sampler1.stop(timeToStop);
            activeSamplerKeys.value.key1 = null;
        } else if (data === activeSamplerKeys.value.key2) {
            const timeToStop = samplerRelease2(releaseTime);
            sampler2.stop(timeToStop);
            activeSamplerKeys.value.key2 = null;
        } else if (data === activeSamplerKeys.value.key3) {
            const timeToStop = samplerRelease3(releaseTime);
            sampler3.stop(timeToStop);
            activeSamplerKeys.value.key3 = null;
        }
    };
    
    // Helper function to get key index
    const getKeyIndex = (key: string): number => {
        const keyMap: Record<string, number> = {
            'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
            'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
        };
        return keyMap[key] || 0;
    };
    // Select sample for a key
    const selectSample = (data: ToneKeyData): AudioBuffer => {
        const keyIndex = data.octave * 12 + getKeyIndex(data.key);
        const sampleIndex = keyIndex % audioBuffers.value.length;
        return audioBuffers.value[sampleIndex];
    };
    // Set audio buffers for sampler
    const setAudioBuffers = (buffers: AudioBuffer[]) => {
        audioBuffers.value = buffers;
    };
    // Set gain for all voices
    const setGain = (value: number) => {
        gain1.value = value;
        gain2.value = value;
        gain3.value = value;
        samplerGain1.value = value;
        samplerGain2.value = value;
        samplerGain3.value = value;
    };
    // Connect all outputs to destination
    const connectToDestination = () => {
        gainNode1.connect(audioContext.value.destination);
        gainNode2.connect(audioContext.value.destination);
        gainNode3.connect(audioContext.value.destination);
        samplerGainNode1.connect(audioContext.value.destination);
        samplerGainNode2.connect(audioContext.value.destination);
        samplerGainNode3.connect(audioContext.value.destination);
    };
    // Computed properties for UI
    const isKeyActive = computed(() => (key: ToneKeyData) => {
        return activeKeyTones.value.key1 === key ||
               activeKeyTones.value.key2 === key ||
               activeKeyTones.value.key3 === key ||
               activeSamplerKeys.value.key1 === key ||
               activeSamplerKeys.value.key2 === key ||
               activeSamplerKeys.value.key3 === key;
    });
    const availableVoices = computed(() => {
        if (type.value === 'synthesizer') {
            return [busy1.value, busy2.value, busy3.value];
        }
        return [activeSamplerKeys.value.key1 !== null, activeSamplerKeys.value.key2 !== null, activeSamplerKeys.value.key3 !== null];
    });
    return {
        // State
        type,
        oscillatorType,
        samplerMode: sampler1.mode, // expose first sampler's mode for UI
        activeKeyTones,
        activeSamplerKeys,
        playKey,
        stopKey,
        setAudioBuffers,
        setGain,
        connectToDestination,
        // Gain controls
        gain1, gain2, gain3, samplerGain1, samplerGain2, samplerGain3,
        attack1, attack2, attack3, samplerAttack1, samplerAttack2, samplerAttack3,
        release1, release2, release3, samplerRelease1, samplerRelease2, samplerRelease3,
        // Computed
        isKeyActive,
        availableVoices,
        // Outputs for external connections
        gainNode1,
        gainNode2,
        gainNode3,
        samplerGainNode1,
        samplerGainNode2,
        samplerGainNode3,
    };
}; 