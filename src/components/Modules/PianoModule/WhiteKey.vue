<template>
    <button :class="[$style.whiteKey, active && $style.active]">
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
</style> 