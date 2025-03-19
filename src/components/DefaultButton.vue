<template>
    <button 
        :class="[
            $style.button,
            type === 'secondary' ? $style.secondary : '',
            square ? $style.square : '',
            { [$style.disabled]: disabled }
        ]" 
        :title="title"
        :disabled="disabled"
        @click="$emit('click')"
    >
        <slot></slot>
    </button>
</template>

<script lang="ts" setup>
defineProps<{
    disabled?: boolean
    square?: false
    type?: 'primary' | 'secondary'
    title?: string
} | {
    disabled?: boolean
    square: true
    type?: 'primary' | 'secondary'
    title: string
}>()

defineEmits<{
    (e: 'click'): void
}>()
</script>

<style lang="scss" module>
.button {
    background-color: var(--button-primary-bg);
    border-radius: var(--button-border-radius);
    border: none;
    box-sizing: border-box;
    color: var(--button-text-color);
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin: 0;
    min-height: 44px;
    min-width: 10px;
    outline: none;
    overflow: hidden;
    padding: 0 10px 0;
    height: 44px;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    transition: all 0.2s ease;

    &:hover:not(.disabled) {
        background-color: var(--button-primary-hover);
        transform: translateY(-1px);
    }

    &:active:not(.disabled) {
        background-color: var(--button-primary-active);
        transform: translateY(0);
    }

    &.disabled {
        background-color: var(--button-disabled-bg);
        color: var(--button-disabled-color);
        cursor: not-allowed;
        transform: none;
    }
    &.square {
        width: 44px;
        padding: 0;
    }
}
.secondary {
    background-color: var(--button-secondary-bg);
    &:hover:not(.disabled) {
        background-color: var(--button-secondary-hover);
    }
}
</style>