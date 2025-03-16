<template>
    <svg 
        :class="$style.icon" 
        :width="size" 
        :height="size" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <!-- Chord squares -->
        <rect x="4" y="8" width="3" height="8" rx="1" :fill="color" />
        <rect x="9" y="8" width="3" height="8" rx="1" :fill="color" opacity="0.7" />
        <rect x="14" y="8" width="3" height="8" rx="1" :fill="color" />
        <rect x="19" y="8" width="3" height="8" rx="1" :fill="color" opacity="0.7" />
        
        <!-- Connection line -->
        <path 
            d="M4 12H22" 
            :stroke="color"
            stroke-width="0.5"
            stroke-dasharray="1 1"
            opacity="0.5"
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