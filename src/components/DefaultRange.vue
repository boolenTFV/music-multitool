<template>
    <div :class="$style.container">
        <input :class="$style.range" type="range" v-model="value" :min="min" :max="max">
        <div :class="$style.minmax">
            <span>{{ min }}</span><span>{{max}}</span>
        </div>
        <div>
            <TextInput v-model="value"></TextInput>
        </div>
    </div>
</template>
<script lang="ts" setup>
import TextInput from './TextInput.vue';

const value = defineModel();
withDefaults(defineProps<{
    min?: number;
    max?: number;
}>(), {
    min: 0,
    max: 100
})
</script>
<style lang="scss" module>
.container {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
@mixin tumb {
    box-shadow: none;
    border: 0px solid #ffffff;
    box-shadow: 0px 10px 10px rgba(0,0,0,0.25);
    height: 42px;
    width: 22px;
    border-radius: 22px;
    background: rgba(255,255,255,1);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -20px;
}

@mixin track {
    box-shadow: none;
    border: 0px solid #ffffff;
    box-shadow: 0px 10px 10px rgba(0,0,0,0.25);
    height: 42px;
    width: 22px;
    border-radius: 22px;
    background: rgba(255,255,255,1);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -20px;
}

.range {
    margin-top: 29px;
    width: 600px;
    appearance: none;
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
        @include tumb();
    }
    &::-moz-range-thumb{
    @include tumb();
    }
    &::-moz-focus-outer {
        border: 0;
    }
}
.minmax {
    display: flex;
    justify-content: space-between;
    color: #ffffff;
    font-size: 20px;
}
</style>