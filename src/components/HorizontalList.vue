<template>
    <div :class="$style.flex_list">
        <slot />
    </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
    gap?: string;
}>(), {
    gap: '5px',
});
</script>
<style module>
.flex_list {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: v-bind(gap);
}
</style>