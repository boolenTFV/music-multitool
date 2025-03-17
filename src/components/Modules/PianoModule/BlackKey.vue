<template>
    <button :class="[$style.blackKey, active && $style.active] ">
    </button>
</template>
<script lang="ts" setup>
defineProps<{
    active: boolean;
}>();
</script>

<style lang="scss" module>
.blackKey {
    user-select: none;
    width: 30px;
    height: 150px;
    background-color: black;
    border: none;
    outline: none;
    border-radius: 0 0 4px 4px;

    &.active, &:active {
        background-color: #333;
    }
    &:hover {
        background-color: #333;
    }
    &:focus {
        background-color: #333;
    }
    &:disabled {
        background-color: #333;
    }
}    
</style>