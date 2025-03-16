<template>
<DefaultDropdown v-model:visible="chordsDropdownVisible">
    <template #trigger>
        <div :class="[$style.chord, isActive && $style.active]">
            <div :class="$style.chord_name" v-if="chord">{{chord.name}}</div>
            <div :class="$style.chord_name" v-else>Select chord</div>
        </div>
    </template>
    <template #dropdown>
        <div :class="$style.chords_dropdown">
            <DefaultOption @click="onSelectChord(null)">
                None
            </DefaultOption>
            <DefaultOption v-for="chord in chords" :key="chord.name" @click="onSelectChord(chord)">
                {{chord.name}}
            </DefaultOption>
        </div>
    </template>
</DefaultDropdown>
</template>
<script setup lang="ts">
import DefaultDropdown from '@/components/DefaultDropdown.vue';
import DefaultOption from '@/components/DefaultOption.vue';

import type { Chord } from '../types';
import { ref } from 'vue';
import { useChords } from './Chords';

const chords = useChords();
const chordsDropdownVisible = ref(false);
defineProps<{
    chord: Chord | null;
    isActive: boolean;
}>();
const emit = defineEmits<{
    (e: 'selectChord', chord: Chord | null): void
}>();
const onSelectChord = (chord: Chord | null) => {
    emit('selectChord', chord);
    chordsDropdownVisible.value = false;
}
</script>

<style lang="scss" module>
.chord {
    width: 100%;
    height: 100px;
    background: var(--accent-color);
    border-radius: var(--button-border-radius);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: var(--hover-color);
    }
}

.chord_name {
    color: var(--font-color);
    font-size: 14px;
    font-weight: 500;
    text-align: center;
}
.chords_dropdown {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-auto-rows: 1fr;
    gap: 2px;
    min-width: 150px;
}
.active {
    box-shadow: 0 0 30px 0 var(--accent-color);
    transform: scale(1.05);
}
</style>