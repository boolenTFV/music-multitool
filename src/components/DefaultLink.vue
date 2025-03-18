<template>
    <a :href="to" :class="$style.link">
        <slot />
    </a>
</template>

<script setup lang="ts">
defineProps<{
    to: string;
}>();
defineOptions({
    inheritAttrs: true
});
</script>

<style lang="scss" module>
.link {
    text-decoration: none;
    transition: all 0.2s ease;
    color: var(--link-color);

    &:hover {
        color: var(--link-hover-color);
        transform: translateY(-1px);
    }

    &:active {
        color: var(--link-active-color);
        transform: translateY(0);
    }
}
</style>