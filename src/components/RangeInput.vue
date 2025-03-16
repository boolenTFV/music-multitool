<template>
    <div :class="$style.container">
        <div :class="$style.input">
            <TextInput type="number" :min="min" :max="max" v-model="value"/>
        </div>
        <input :class="$style.range" type="range" v-model="value" :min="min" :max="max">
        <div :class="$style.minmax">
            <span>{{ min }}</span><span>{{max}}</span>
        </div>

    </div>
</template>

<script lang="ts" setup>
import TextInput from './TextInput.vue';
import useDelayedWatch from '@/composables/useDelayedWatch';

const props = withDefaults(defineProps<{
    min?: number;
    max?: number;
}>(), {
    min: 0,
    max: 100
})
const value = defineModel();

useDelayedWatch(value, () => {
    const innerValue = Number(value.value);
    if(Number.isNaN(innerValue)) return;
    if(innerValue < props.min) {
        value.value = props.min
    }
    if(innerValue > props.max) {
        value.value = props.max
    }
}, 1000);
</script>

<style lang="scss" module>
.container {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

@mixin thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--button-primary-bg);
    cursor: pointer;
    margin-top: -7px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    &:hover {
        transform: scale(1.1);
        background: var(--button-primary-hover);
    }

    &:active {
        transform: scale(0.95);
        background: var(--button-primary-active);
    }
}

@mixin track {
    appearance: none;
    width: 100%;
    height: 4px;
    background: var(--block-color);
    border-radius: 2px;
    cursor: pointer;
}

.range {
    appearance: none;
    width: 100%;
    margin: 8px 0;
    background: transparent;

    &:focus {
        outline: none;
    }

    &::-webkit-slider-runnable-track {
        @include track();
    }

    &::-moz-range-track {
        @include track();
    }
  
    &::-webkit-slider-thumb {
        @include thumb();
    }

    &::-moz-range-thumb {
        @include thumb();
    }

    &::-moz-focus-outer {
        border: 0;
    }

    &::-webkit-slider-thumb:hover {
        @include thumb();
    }
}

.minmax {
    display: flex;
    justify-content: space-between;
    color: var(--font-color);
    font-size: 14px;
    font-weight: 500;
    padding: 0 4px;
}
.input {
    display: flex;
    justify-content: center;
    color: var(--font-color);
    font-size: 14px;
    font-weight: 500;
    padding: 0 4px;
}
</style>