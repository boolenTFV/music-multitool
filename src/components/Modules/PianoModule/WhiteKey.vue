<template>
    <button :class="[$style.whiteKey, active && $style.active]">
        <span :class="$style.hint"><slot /></span>
    </button>
</template>
<script lang="ts" setup>
defineProps<{
    active: boolean;
}>();
</script>
<style lang="scss" module>
.whiteKey {
    user-select: none;
    width: 50px;
    background-color: white;
    border: none;
    outline: none;
    border-radius: 0 0 4px 4px;
    min-height: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    padding: 0 0 30px;
    &:hover {
        background-color: #f0f0f0;
    }

    &:active, &.active {
        background-color: #e0e0e0;
    }

    &:focus {
        background-color: #f0f0f0;
    }

    &:disabled {
        background-color: #f0f0f0;
    }

}
.hint {
    text-align: center;
    transform: translateY(100%);
    font-size: 12px;
    color: #000;
}
</style> 