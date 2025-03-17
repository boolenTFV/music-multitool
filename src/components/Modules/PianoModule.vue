    <template>
        <BlockContainer>
            <template #heading>Keyboard</template>
            <div :class="$style.container">
                <div :class="$style.tool_panel">
                    <HorizontalList>             
                        <DefaultButton :type="oscillatorType === 'sine' ? 'primary' : 'secondary'" square @click="oscillatorType = 'sine'">
                            <SineWaveIcon></SineWaveIcon>
                        </DefaultButton>
                        <DefaultButton :type="oscillatorType === 'square' ? 'primary' : 'secondary'" square @click="oscillatorType = 'square'">
                            <SquareWaveIcon></SquareWaveIcon>
                        </DefaultButton>
                        <DefaultButton :type="oscillatorType === 'triangle' ? 'primary' : 'secondary'" square @click="oscillatorType = 'triangle'">
                            <TriangleWaveIcon></TriangleWaveIcon>
                        </DefaultButton>
                        <DefaultButton :type="oscillatorType === 'sawtooth' ? 'primary' : 'secondary'" square @click="oscillatorType = 'sawtooth'">
                            <SawtoothWaveIcon></SawtoothWaveIcon>
                        </DefaultButton>
                    </HorizontalList>
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
    import { onUnmounted } from "vue";
    import BlockContainer from "@/components/BlockContainer.vue";
    import WhiteKey from "@/components/Modules/PianoModule/WhiteKey.vue";
    import BlackKey from "@/components/Modules/PianoModule/BlackKey.vue";
    import DefaultButton from "@/components/DefaultButton.vue";
    import SineWaveIcon from "@/components/Icons/SineWaveIcon.vue";
    import SquareWaveIcon from "@/components/Icons/SquareWaveIcon.vue";
    import TriangleWaveIcon from "@/components/Icons/TriangleWaveIcon.vue";
    import SawtoothWaveIcon from "@/components/Icons/SawtoothWaveIcon.vue";
    import HorizontalList from "@/components/HorizontalList.vue";
    import type { PianoToneKeyData } from "./types";
    import { useSynthLogic } from "./PianoModule/useSynthLogic";

    const { keys, playKey, stopKey, oscillatorType, activeKeyTones} = useSynthLogic();
    const keyboardKeyCodes = ['KeyA', 'KeyW', 'KeyS', 'KeyE', 'KeyD', 'KeyF', 'KeyT', 'KeyG', 'KeyY', 'KeyH', 'KeyU', 'KeyJ', 'KeyK', 'KeyL', 'KeyO', 'KeyP', 'Semicolon', 'BracketLeft', 'BracketRight', 'Quote', 'Backquote'];

    const mouseLeave = (event: MouseEvent, data: PianoToneKeyData) => {
        stopKey(data);
    }
    const mouseEnter = (event: MouseEvent, data: PianoToneKeyData) => {
        if(event.buttons === 1) {
            playKey(data);
        }
    }

    const onKeydown = (e: KeyboardEvent) => {
        if (e.repeat) { return }
        const octaveShift = 12;
        if(!keyboardKeyCodes.includes(e.code) ) return
        const index = keyboardKeyCodes.indexOf(e.code)
        if(index === -1) return;
        playKey(keys.value[index + octaveShift]);
    };
    const onKeyup = (e: KeyboardEvent) => {
        const octaveShift = 12;
        if(!keyboardKeyCodes.includes(e.code) ) return
        const index = keyboardKeyCodes.indexOf(e.code)
        if(index === -1) return;
        stopKey(keys.value[index + octaveShift]);
    };

    window.addEventListener('keydown', onKeydown);
    window.addEventListener('keyup', onKeyup);
    onUnmounted(() => {
        window.removeEventListener('keydown', onKeydown);
        window.removeEventListener('keyup', onKeyup);
    });
    </script>
    <style module>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        height: calc(100% - 60px);
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
        padding-left: 10px;
        z-index: 1;
        width: 100%;
        height: 60px;
        background-color: #f0f0f0;
        border-radius: 4px 4px 0 0;
        border: none;
        box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.1);
    }
    .switch_label {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    </style>