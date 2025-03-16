<template>
    <div :class="$style.container" ref="dropdownRef">
        <div :class="$style.trigger" @click="visible = !visible">
            <slot name="trigger"></slot>
        </div>
        <div :class="$style.dropdown" v-show="visible">
            <slot name="dropdown">
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useClickOutside } from '@/composables/useClickOutside';
import { ref } from 'vue';
const visible = defineModel<boolean>("visible");

const dropdownRef = ref<HTMLElement | null>(null);

useClickOutside(dropdownRef, () => visible.value = false);
</script>

<style lang="scss" module>
.container {
    position: relative;
}
.dropdown {
    position: absolute;
    z-index: 1000;
    top: 100%;
    left: 0;
    border-radius: 10px;
    background-color: var(--dropdown-background-color);
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 250px;
}
</style>
