<template>
    <svg 
        :class="$style.icon" 
        :width="size" 
        :height="size" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect 
            x="6" 
            y="6" 
            width="12" 
            height="12" 
            rx="1" 
            stroke="none"
            :fill="color"
        />
    </svg>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
    size?: number
    color?: string
}>(), {
    size: 24,
    color: 'currentColor'
})
</script>

<style lang="scss" module>
.icon {
    display: block;
    transition: transform 0.2s ease;
}
</style> 