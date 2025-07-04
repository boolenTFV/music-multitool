    <template>
        <BlockContainer :class="$style.block_container">
            <template #heading>Keyboard</template>
            <div :class="$style.container">
                <div :class="$style.tool_panel">
                    <div :class="$style.button_container">    
                        <DefaultButton
                            v-for="item in oscillatorTypes"
                            :key="item"
                            :title="item"
                            :type="oscillatorType === item && type === 'synthesizer' ? 'primary' : 'secondary'"
                            square
                            @click="oscillatorType = item, type = 'synthesizer'"
                        >
                            <SineWaveIcon v-if="item === 'sine'" />
                            <SquareWaveIcon v-if="item === 'square'" />
                            <TriangleWaveIcon v-if="item === 'triangle'" />
                            <SawtoothWaveIcon v-if="item === 'sawtooth'" />
                        </DefaultButton>
                        <DefaultButton
                            title="Sampler"
                            :type="type === 'sampler' ? 'primary' : 'secondary'"
                            square
                            @click="type = 'sampler'"
                        >
                            <SamplerIcon/>
                        </DefaultButton>
                        
                        <DefaultButton
                            @click="showAudioBufferModalVisible = true"
                            v-if="type === 'sampler'"
                            square
                            title="Sampler settings"
                        >
                            <SettingsIcon/>
                        </DefaultButton>
                    </div>
                    <div :class="$style.range_container">
                        <label :class="$style.range_label">
                            <span>Attack</span>
                            <RangeInput v-model="attackTime" type="number" :min="10" :max="1000" :step="10" compact/>
                        </label>
                        <label :class="$style.range_label">
                            <span>Release</span>
                            <RangeInput v-model="releaseTime" type="number" :min="10" :max="1000" :step="10" compact/>
                        </label>
                    </div>
                    <div :class="$style.range_container">
                        <label :class="$style.range_label">
                            <span>Gain</span>
                            <RangeInput v-model="gain" type="number" :min="0" :max="200" :step="5" compact/>
                        </label>
                    </div>
                </div>
            <div :class="$style.keyboard">
                <template v-for="(data, index) in keys" :key="index">
                    <WhiteKey
                        v-if="data.type === 'white'"
                        @mousedown="play(data)"
                        @mouseup="stop(data)"
                        @mouseleave="(event) => mouseLeave(event, data)"
                        @mouseenter="(event) => mouseEnter(event, data)"
                        @touchstart="play(data)"
                        @touchend="stop(data)"
                        :class="[$style.pianoKey, $style.whiteKey]"
                        :key="`${data.key}${data.octave}`"
                        :active="
                            activeKeyTones.key1 === data
                            || activeKeyTones.key2 === data
                            || activeKeyTones.key3 === data
                            || activeSamplerKeys.key1 === data
                            || activeSamplerKeys.key2 === data
                            || activeSamplerKeys.key3 === data
                        "
                    >
                        {{ getSynthesizerKeyHint(data, index).value }}
                        <sup v-if="getSynthesizerKeyHint(data, index).sup">{{ getSynthesizerKeyHint(data, index).sup }}</sup>
                    </WhiteKey>
                    <BlackKey
                        v-if="data.type === 'black'"
                        @mousedown="play(data)"
                        @mouseup="stop(data)"
                        @touchstart="play(data)"
                        @touchend="stop(data)"
                        @mouseleave="(event) => mouseLeave(event, data)"
                        @mouseenter="(event) => mouseEnter(event, data)"
                        :class="[$style.pianoKey, $style.blackKey]"
                        :key="`${data.key}${data.octave}`"
                        :active="
                            activeKeyTones.key1 === data
                            || activeKeyTones.key2 === data
                            || activeKeyTones.key3 === data
                            || activeSamplerKeys.key1 === data
                            || activeSamplerKeys.key2 === data
                            || activeSamplerKeys.key3 === data
                        "
                    >
                        
                        {{ getSynthesizerKeyHint(data, index).value }}
                        <sup v-if="getSynthesizerKeyHint(data, index).sup">{{ getSynthesizerKeyHint(data, index).sup }}</sup>
                    </BlackKey>
                </template>
                </div>
            </div>
            <ModalComponent
                v-if="showAudioBufferModalVisible"
                fullscreen
                @closeModal="showAudioBufferModalVisible = false"
            >
                <template #header>
                    Sampler settings
                </template>
                <div :class="$style.settings_container">
                    <h2>Samples</h2>
                    <AudioBufferCut
                        v-model="audioBuffersSplited"
                    >
                </AudioBufferCut>
                <h2>Parameters</h2>
                <label :class="$style.settings_item">
                    <span>Synthesizer mode</span>
                    <select v-model="samplerMode">
                        <option disabled value="">Select mode</option>
                        <option value="classic">classic</option>
                        <option value="loop">loop</option>
                    </select>
                </label>
                </div>
                
            </ModalComponent>
        </BlockContainer>
    </template>
    <script lang="ts" setup>
    import { onMounted, onUnmounted, ref, watch } from "vue";
    import BlockContainer from "@/components/BlockContainer.vue";
    import WhiteKey from "@/components/Modules/PianoModule/WhiteKey.vue";
    import BlackKey from "@/components/Modules/PianoModule/BlackKey.vue";
    import DefaultButton from "@/components/DefaultButton.vue";
    import SineWaveIcon from "@/components/Icons/SineWaveIcon.vue";
    import SquareWaveIcon from "@/components/Icons/SquareWaveIcon.vue";
    import TriangleWaveIcon from "@/components/Icons/TriangleWaveIcon.vue";
    import SawtoothWaveIcon from "@/components/Icons/SawtoothWaveIcon.vue";
    import RangeInput from "@/components/RangeInput.vue";
    import { useUnifiedSynth } from "@/composables/useUnifiedSynth";
    import type { PianoToneKeyData } from "./types";
    import ModalComponent from "@/components/ModalComponent.vue";
    import AudioBufferCut from "@/components/AudioBufferCut.vue";
    import { useAudioRecorder } from "@/composables/useAudioRecoreder";
    import { computed } from "vue";
    import SettingsIcon from "../Icons/SettingsIcon.vue";
    import SamplerIcon from "../Icons/SamplerIcon.vue";
    import { exhaustiveMatchGuard } from "@/utils/types";
    import { generateOctave } from "./PianoModule/useKeys";

    const oscillatorTypes:("sine" | "square" | "triangle" | "sawtooth")[] = ['sine', 'square', 'triangle', 'sawtooth'];

    const attackTime = ref(10);
    const releaseTime = ref(200);
    const gain = ref(80);
    
    // Use the unified synth composable
    const {
        type,
        oscillatorType,
        samplerMode,
        activeKeyTones,
        activeSamplerKeys,
        playKey,
        stopKey,
        setAudioBuffers,
        setGain,
        connectToDestination,
    } = useUnifiedSynth();
    
    const audioBuffersSplited = ref<AudioBuffer[]>([]);
    const {
        isRecorded: isRecordedSampler,
        audioBuffer: audioBufferRecoreded
    } = useAudioRecorder()

    const showAudioBufferModalVisible = ref(false);
    const keyboardKeyCodes = ['KeyA', 'KeyW', 'KeyS', 'KeyE', 'KeyD', 'KeyF', 'KeyT', 'KeyG', 'KeyY', 'KeyH', 'KeyU', 'KeyJ', 'KeyK', 'KeyL', 'KeyO', 'KeyP', 'Semicolon', 'BracketLeft', 'BracketRight', 'Quote', 'Backquote'];

    // Generate keys
    const keys = ref<PianoToneKeyData[]>([...generatePianoOctave(3),...generatePianoOctave(4), ...generatePianoOctave(5), ...generatePianoOctave(6)]);

    const samplerSamples = computed(() => {
        if(audioBuffersSplited.value.length > 0) {
            return audioBuffersSplited.value;
        }
        if(audioBufferRecoreded.value) {
            return [audioBufferRecoreded.value];
        }
        return [];
    })

    const getSynthesizerKeyHint = (pianoToneKeyData: PianoToneKeyData, index: number) => {
        switch(type.value) {
            case "synthesizer": return {
                value: pianoToneKeyData.key + pianoToneKeyData.octave
            };
            case "sampler": {
                if(samplerSamples.value.length === 0) {
                    return {}
                }
                return {
                    value: index % samplerSamples.value.length + 1,
                    sup: Math.floor(index / audioBuffersSplited.value.length)
                };
            }
            default: throw exhaustiveMatchGuard(type.value);
        }
    }

    async function play(data: PianoToneKeyData) {
        const index = keys.value.indexOf(data);
        const semitones = type.value === 'sampler' ? index - 12 : 0;
        return playKey(data, attackTime.value, semitones);
    }

    function stop(data: PianoToneKeyData) {
        stopKey(data, releaseTime.value);
    }

    const mouseLeave = (_: MouseEvent, data: PianoToneKeyData) => {
        stop(data);
    }
    const mouseEnter = (event: MouseEvent, data: PianoToneKeyData) => {
        if(event.buttons === 1) {
            play(data);
        }
    }
    
    watch(gain, (value) => {
        setGain(value/100);
    }, {immediate: true});

    const onKeydown = (e: KeyboardEvent) => {
        if (e.repeat) { return }
        const octaveShift = 12;
        if(!keyboardKeyCodes.includes(e.code) ) return
        const index = keyboardKeyCodes.indexOf(e.code)
        if(index === -1) return;
        play(keys.value[index + octaveShift]);
    };

    const onKeyup = (e: KeyboardEvent) => {
        const octaveShift = 12;
        if(!keyboardKeyCodes.includes(e.code) ) return
        const index = keyboardKeyCodes.indexOf(e.code)
        if(index === -1) return;
        stop(keys.value[index + octaveShift]);
    };
    
    // Watch for audio buffer changes and update the unified synth
    watch(samplerSamples, (samples) => {
        setAudioBuffers(samples);
    }, { immediate: true });

    onMounted(() => {
        connectToDestination();
        window.addEventListener('keydown', onKeydown);
        window.addEventListener('keyup', onKeyup);
    })
    
    onUnmounted(() => {
        window.removeEventListener('keydown', onKeydown);
        window.removeEventListener('keyup', onKeyup);
    });
    
    watch(isRecordedSampler, (value) => {
        if(value) {
            type.value = 'sampler';
        } else {
            type.value = 'synthesizer';
        }
    });

    // Helper function to generate piano octave
    function generatePianoOctave(octave: number): PianoToneKeyData[] {
        const octaveKeys = generateOctave(octave);
        const keyTypes = ["white", "black", "white", "black", "white", "white", "black", "white", "black", "white", "black", "white"];
        return octaveKeys.map((item, index) => ({...item, type: keyTypes[index]})) as PianoToneKeyData[];
    }

    </script>
    <style module>
    .block_container {
        user-select: none;
    }
    .container {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        height: 100%;
        @media (max-width: 600px) {
            max-height: 500px;
        }
    }
    .keyboard {
        min-height: 250px;
        user-select: none;
        display: flex;
        flex: 1;
        position: relative;
        flex-direction: row;
        overflow-x: scroll;
        width: 100%;
    }
    .pianoKey {
        flex: 0 0 auto;
    }
    .whiteKey {
        &:not(:last-child) {
            margin-right: 1px;
        }
    }
    .blackKey {
        margin-left: -15px;
        margin-right: -15px;
        position: relative;
    }
    .tool_panel {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        align-items: center;
        padding: 10px;
        z-index: 1;
        width: calc(100% - 20px);
        height: auto;
        background-color: #f0f0f0;
        border-radius: 4px 4px 0 0;
        border: none;
        box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.1);
        flex: 0 0 auto;
        gap: 20px;
        @media (max-width: 600px) {
            gap: 5px;
        }
    }
    .switch_label {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .range_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        min-height: 46px;
        gap: 5px;
    }
    .range_label {
        display: flex;
        align-items: center;
        color: var(--primary-dark-color);
        gap: 10px;
        span {
            min-width: 70px;
        }
    }
    .button_container {
        display: flex;
        align-items: center;
        gap: 5px;
        
        @media (max-width: 600px) {
            flex-wrap: wrap;
            padding-bottom: 10px;
            width: 100%;
        }
    }
    .settings_container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .settings_item {
        align-items: start;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    </style>