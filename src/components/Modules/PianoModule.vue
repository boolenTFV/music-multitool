    <template>
        <BlockContainer :class="$style.block_container">
            <template #heading>Keyboard</template>
            <div :class="$style.container">
                <div :class="$style.tool_panel">
                    <div :class="$style.button_container">    
                        <DefaultButton title="Sine" :type="oscillatorType === 'sine' ? 'primary' : 'secondary'" square @click="oscillatorType = 'sine'">
                            <SineWaveIcon></SineWaveIcon>
                        </DefaultButton>
                        <DefaultButton title="Square" :type="oscillatorType === 'square' ? 'primary' : 'secondary'" square @click="oscillatorType = 'square'">
                            <SquareWaveIcon></SquareWaveIcon>
                        </DefaultButton>
                        <DefaultButton title="Triangle" :type="oscillatorType === 'triangle' ? 'primary' : 'secondary'" square @click="oscillatorType = 'triangle'">
                            <TriangleWaveIcon></TriangleWaveIcon>
                        </DefaultButton>
                        <DefaultButton title="Sawtooth" :type="oscillatorType === 'sawtooth' ? 'primary' : 'secondary'" square @click="oscillatorType = 'sawtooth'">
                            <SawtoothWaveIcon></SawtoothWaveIcon>
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
                            <RangeInput v-model="maxVolume" type="number" :min="0" :max="1" :step="0.1" compact/>
                        </label>
                    </div>

                </div>
            <div :class="$style.piano">
                <template v-for="(data, index) in keys" :key="index">
                    <WhiteKey
                        v-if="data.type === 'white'"
                        @mousedown="playKey(data)"
                        @mouseup="stopKey(data)"
                        @mouseleave="(event) => mouseLeave(event, data)"
                        @mouseenter="(event) => mouseEnter(event, data)"
                        @touchstart="playKey(data)"
                        @touchend="stopKey(data)"
                        :class="[$style.pianoKey, $style.whiteKey]"
                        :key="`${data.key}${data.octave}`"
                        :active="activeKeyTones.key1 === data || activeKeyTones.key2 === data || activeKeyTones.key3 === data"
                    />
                    <BlackKey
                        v-if="data.type === 'black'"
                        @mousedown="playKey(data)"
                        @mouseup="stopKey(data)"
                        @touchstart="playKey(data)"
                        @touchend="stopKey(data)"
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
    import { onUnmounted, ref } from "vue";
    import BlockContainer from "@/components/BlockContainer.vue";
    import WhiteKey from "@/components/Modules/PianoModule/WhiteKey.vue";
    import BlackKey from "@/components/Modules/PianoModule/BlackKey.vue";
    import DefaultButton from "@/components/DefaultButton.vue";
    import SineWaveIcon from "@/components/Icons/SineWaveIcon.vue";
    import SquareWaveIcon from "@/components/Icons/SquareWaveIcon.vue";
    import TriangleWaveIcon from "@/components/Icons/TriangleWaveIcon.vue";
    import SawtoothWaveIcon from "@/components/Icons/SawtoothWaveIcon.vue";
    import RangeInput from "@/components/RangeInput.vue";
    import { useSynthLogic } from "./PianoModule/useSynthLogic";
import type { PianoToneKeyData } from "./types";

    const attackTime = ref(10);
    const releaseTime = ref(200);

    const { keys, playKey, stopKey, oscillatorType, activeKeyTones, maxVolume} = useSynthLogic();
    const keyboardKeyCodes = ['KeyA', 'KeyW', 'KeyS', 'KeyE', 'KeyD', 'KeyF', 'KeyT', 'KeyG', 'KeyY', 'KeyH', 'KeyU', 'KeyJ', 'KeyK', 'KeyL', 'KeyO', 'KeyP', 'Semicolon', 'BracketLeft', 'BracketRight', 'Quote', 'Backquote'];



    const mouseLeave = (event: MouseEvent, data: PianoToneKeyData) => {
        stopKey(data, releaseTime.value);
    }
    const mouseEnter = (event: MouseEvent, data: PianoToneKeyData) => {
        if(event.buttons === 1) {
            playKey(data, attackTime.value);
        }
    }

    const onKeydown = (e: KeyboardEvent) => {
        if (e.repeat) { return }
        const octaveShift = 12;
        if(!keyboardKeyCodes.includes(e.code) ) return
        const index = keyboardKeyCodes.indexOf(e.code)
        if(index === -1) return;
        playKey(keys.value[index + octaveShift], attackTime.value);
    };
    const onKeyup = (e: KeyboardEvent) => {
        const octaveShift = 12;
        if(!keyboardKeyCodes.includes(e.code) ) return
        const index = keyboardKeyCodes.indexOf(e.code)
        if(index === -1) return;
        stopKey(keys.value[index + octaveShift], releaseTime.value);
    };

    window.addEventListener('keydown', onKeydown);
    window.addEventListener('keyup', onKeyup);
    onUnmounted(() => {
        window.removeEventListener('keydown', onKeydown);
        window.removeEventListener('keyup', onKeyup);
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
            height: calc(100vh);
            max-height: 500px;
        }
    }
    .piano {
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
        justify-content: start;
        align-items: center;
        padding: 10px;
        z-index: 1;
        width: calc(100% - 20px);
        height: 60px;
        background-color: #f0f0f0;
        border-radius: 4px 4px 0 0;
        border: none;
        box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.1);
        flex: 0 0 auto;
        gap: 20px;
        @media (max-width: 600px) {
            flex-direction: column;
            height: auto;
            gap: 5px;
            align-items: center;
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
            padding-bottom: 10px;
        }
    }
    </style>