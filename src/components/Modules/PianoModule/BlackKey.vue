<template>
    <button :class="[$style.blackKey, active && $style.active] ">
        <span :class="$style.hint"><slot /></span>
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
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    padding: 0 0 30px;
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
.hint {
    text-align: center;
    transform: translateY(100%);
    font-size: 10px;
    color: #fff;
}
</style>