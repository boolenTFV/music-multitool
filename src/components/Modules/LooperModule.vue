<template>
<BlockContainer>
    <template #heading>
        Looper
    </template>
    <VerticalList :class="$style.container" justify="space-between">
        <div :class="$style.loopers">
            <LooperNode v-for="i in loppersCount" :key="i" />
        </div>
        
        <HorizontalList>
            <DefaultButton @click="loppersCount++" :disabled="loppersCount >= 8" square title="Add looper">+</DefaultButton>
            <DefaultButton @click="loppersCount--" :disabled="loppersCount <= 1" square title="Remove looper">-</DefaultButton>
            <DefaultButton @click="playAll" square title="Play all loopers"><PlayIcon :size="24"/></DefaultButton>
            <DefaultButton @click="stopAll" square title="Stop all loopers"><StopIcon /></DefaultButton>
            <DefaultButton @click="clearAll" square title="Clear all loopers"><ClearIcon /></DefaultButton>
        </HorizontalList>
    </VerticalList>
</BlockContainer>
</template>
<script setup lang="ts">
import BlockContainer from '../BlockContainer.vue';
import LooperNode from './LooperModule/LooperNode.vue';
import PlayIcon from '@/components/Icons/PlayIcon.vue';
import StopIcon from '@/components/Icons/StopIcon.vue';
import ClearIcon from '../Icons/ClearIcon.vue';
import DefaultButton from '../DefaultButton.vue';
import { CLEAR_EVENT, looperEventTarget, PLAY_EVENT, STOP_EVENT } from '@/eventTargets/looperEventTarget';
import { ref } from 'vue';
import HorizontalList from '../HorizontalList.vue';
import VerticalList from '../VerticalList.vue';
const loppersCount = ref(8);

function playAll() {
  looperEventTarget.dispatchEvent(new Event(PLAY_EVENT))
}
function stopAll() {
  looperEventTarget.dispatchEvent(new Event(STOP_EVENT))
}
function clearAll() {
  looperEventTarget.dispatchEvent(new Event(CLEAR_EVENT))
}

</script>
<style lang="scss" module>
.container {
    height: 100%;
}
.loopers {
    display: grid;
    width: 100%;
    gap: 8px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    flex: 0 0 auto;
}
@media (max-width: 950px) {
    .container {
        height: auto;
    }
    .loopers {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
@media (max-width: 600px) {
    .loopers {
        grid-template-columns: 1fr 1fr;
    }
}
</style>
