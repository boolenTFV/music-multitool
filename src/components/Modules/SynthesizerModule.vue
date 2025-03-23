    <template>
        <BlockContainer :class="$style.block_container">
            <template #heading>Keyboard</template>
            <div :class="$style.container">
                <div :class="$style.tool_panel">
                    <div :class="$style.button_container">    
                        <DefaultButton
                            title="Sine"
                            :type="oscillatorType === 'sine' ? 'primary' : 'secondary'"
                            square
                            @click="oscillatorType = 'sine'"
                            :disabled="type === 'sampler'"
                        >
                            <SineWaveIcon />
                        </DefaultButton>
                        <DefaultButton
                            title="Square"
                            :type="oscillatorType === 'square' ? 'primary' : 'secondary'"
                            square
                            @click="oscillatorType = 'square'"
                            :disabled="type === 'sampler'"
                        >
                            <SquareWaveIcon />
                        </DefaultButton>
                        <DefaultButton
                            title="Triangle"
                            :type="oscillatorType === 'triangle' ? 'primary' : 'secondary'"
                            square
                            @click="oscillatorType = 'triangle'"
                            :disabled="type === 'sampler'"
                        >
                            <TriangleWaveIcon />
                        </DefaultButton>
                        <DefaultButton
                            title="Sawtooth"
                            :type="oscillatorType === 'sawtooth' ? 'primary' : 'secondary'"
                            square
                            @click="oscillatorType = 'sawtooth'"
                            :disabled="type === 'sampler'"
                        >
                            <SawtoothWaveIcon />
                        </DefaultButton>
                        <DefaultButton
                            title="Record" @click="recordSample"
                            v-if="!isRecordedSampler && !isRecordingSampler"
                            square
                        >
                            <RecordIcon :size="24"/>
                        </DefaultButton>
                        <DefaultButton
                            title="Stop"
                            @click="stopRecordSample"
                            v-if="isRecordingSampler"
                            square
                        >
                            <StopIcon :size="24"/>
                        </DefaultButton>
                        <DefaultButton
                            title="Clear"
                            @click="handleClearSample"
                            v-if="isRecordedSampler"
                            square
                        >
                            <ClearIcon :size="24"/>
                        </DefaultButton>
                        <UploaderInput
                            @change="handelChangeFile"
                            ref="uploaderInput"
                        />
                        <DefaultButton
                            @click="trimSilenceHandler"
                            v-if="!isRecordingSampler && isRecordedSampler"
                        >
                            Trim silence
                        </DefaultButton>
                    </div>
                    <div :class="$style.button_container" v-if="type === 'sampler'">
                        <label :class="$style.range_label">
                            <span>{{ modeSampler }}</span>
                            <select v-model="modeSampler">
                                <option disabled value="">Select mode</option>
                                <option value="classic">classic</option>
                                <option value="continous">continious</option>
                                <option value="splited">splited</option>
                            </select>
                            
                        </label>
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
                        :active="activeKeyTones.key1 === data || activeKeyTones.key2 === data || activeKeyTones.key3 === data"
                    />
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
                        :active="activeKeyTones.key1 === data || activeKeyTones.key2 === data || activeKeyTones.key3 === data"
                    />
                </template>
                </div>
            </div>
        </BlockContainer>
    </template>
    <script lang="ts" setup>
    import { onUnmounted, ref, watch } from "vue";
    import BlockContainer from "@/components/BlockContainer.vue";
    import WhiteKey from "@/components/Modules/PianoModule/WhiteKey.vue";
    import BlackKey from "@/components/Modules/PianoModule/BlackKey.vue";
    import DefaultButton from "@/components/DefaultButton.vue";
    import SineWaveIcon from "@/components/Icons/SineWaveIcon.vue";
    import SquareWaveIcon from "@/components/Icons/SquareWaveIcon.vue";
    import TriangleWaveIcon from "@/components/Icons/TriangleWaveIcon.vue";
    import SawtoothWaveIcon from "@/components/Icons/SawtoothWaveIcon.vue";
    import StopIcon from "@/components/Icons/StopIcon.vue";
    import ClearIcon from "@/components/Icons/ClearIcon.vue";
    import RecordIcon from "@/components/Icons/RecordIcon.vue";
    import RangeInput from "@/components/RangeInput.vue";
    import { useSynthLogic } from "./PianoModule/useSynthLogic";
    import { useSampler } from "./PianoModule/useSampler";
    import type { PianoToneKeyData } from "./types";
    import { trimSilence } from "@/utils/trimSilence";
    import { useAudioContext } from "@/composables/useAudioContext";
    import UploaderInput from "@/components/UploaderInput.vue";

    const uploaderInput = ref<InstanceType<typeof UploaderInput>>();
    const audioContext = useAudioContext();
    const type = ref<'synthesizer' | 'sampler'>('synthesizer');
    const attackTime = ref(10);
    const releaseTime = ref(200);
    const gain = ref(80);
    const { keys, playKey: playKeySynthesizer, stopKey: stopKeySynthesizer, oscillatorType, activeKeyTones, maxVolume} = useSynthLogic();
    const {
        play: playSampler,
        stop: stopSampler,
        record: recordSample,
        stopRecord: stopRecordSample,
        clearRecord: clearRecordSample,
        isRecording: isRecordingSampler,
        isRecorded: isRecordedSampler,
        audioBuffer: audioBufferSampler,
        mode: modeSampler,
        maxGain: maxGainSampler
    } = useSampler();
    const keyboardKeyCodes = ['KeyA', 'KeyW', 'KeyS', 'KeyE', 'KeyD', 'KeyF', 'KeyT', 'KeyG', 'KeyY', 'KeyH', 'KeyU', 'KeyJ', 'KeyK', 'KeyL', 'KeyO', 'KeyP', 'Semicolon', 'BracketLeft', 'BracketRight', 'Quote', 'Backquote'];
    const currentSamplerKey = ref<PianoToneKeyData>();
    async function play(data: PianoToneKeyData) {
        if(type.value === 'synthesizer') {
            playKeySynthesizer(data, attackTime.value);
        } else {
            const index = keys.value.indexOf(data);
            if(currentSamplerKey.value) {
                stopSampler(releaseTime.value);
            }
            currentSamplerKey.value = data;
            playSampler(index, attackTime.value);
        }
    }
    function stop(data: PianoToneKeyData) {
        if(type.value === 'synthesizer') {
            stopKeySynthesizer(data, releaseTime.value);
        } else {
            if(currentSamplerKey.value === data) {
                stopSampler(releaseTime.value);
                currentSamplerKey.value = undefined;
            }
        }
    }

    const mouseLeave = (_: MouseEvent, data: PianoToneKeyData) => {
        stop(data);
    }
    const mouseEnter = (event: MouseEvent, data: PianoToneKeyData) => {
        if(event.buttons === 1) {
            play(data);
        }
    }
    const handelChangeFile = async (file: File) => {
        if(file) {
            const arrayBuffer = await file.arrayBuffer();
            audioBufferSampler.value = await audioContext.value.decodeAudioData(arrayBuffer);
        }
    }
    const handleClearSample = () => {
        clearRecordSample();
        uploaderInput.value?.clear();
    }

    watch(gain, (value) => {
        maxGainSampler.value = value/100;
        maxVolume.value = value/100;
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

    const trimSilenceHandler = () => {
        if(audioBufferSampler.value) {
            audioBufferSampler.value = trimSilence(audioBufferSampler.value);
        }
    }

    window.addEventListener('keydown', onKeydown);
    window.addEventListener('keyup', onKeyup);
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
    </style>