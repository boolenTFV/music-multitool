<template>
    <svg 
    :class="$style.icon" 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
>
    <!-- Knife blade -->
    <path 
        d="M19 3L5 21C4.5 21.5 3.5 21.5 3 21C2.5 20.5 2.5 19.5 3 19L17 1L19 3Z" 
        :fill="color"
    />
    
    <!-- Blade edge highlight -->
    <path 
        d="M17 1L4 19" 
        stroke="white" 
        stroke-width="0.5" 
        stroke-opacity="0.5"
    />
    
    <!-- Handle -->
    <circle 
        cx="19" 
        cy="3" 
        r="3" 
        :fill="color"
    />
    <circle 
        cx="19" 
        cy="3" 
        r="1.5" 
        fill="white"
    />
    
    <!-- Grip lines -->
    <path 
        d="M20 5V7" 
        stroke="white" 
        stroke-width="1.5" 
        stroke-linecap="round"
    />
    <path 
        d="M20 9V11" 
        stroke="white" 
        stroke-width="1.5" 
        stroke-linecap="round"
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