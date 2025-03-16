<template>
    <input :class="$style.input" v-model="value" type="text">
</template>
<script lang="ts" setup>
const value = defineModel()
</script>
<style lang="scss" module>
.input {
    background-color: var(--input-background-color);
    color: var(--font-color);
    padding: 8px 16px;
    outline: none;
    border: 1px solid var(--input-border-color);
    border-radius: 4px;
    appearance: textfield;
    font-size: 18px;
    transition: all 0.2s ease;

    &:hover {
        background-color: var(--input-background-color-hover);
        border-color: var(--input-border-color);
    }

    &:focus {
        background-color: var(--input-background-color-focus);
        border-color: var(--input-focus-border-color);
    }

    &:disabled {
        background-color: var(--input-background-color-disabled);
        color: var(--input-disabled-color);
        cursor: not-allowed;
    }

    &::placeholder {
        color: var(--input-placeholder-color);
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
}
</style>