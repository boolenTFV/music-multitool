<template>
    <svg 
        :class="$style.icon" 
        :width="size" 
        :height="size" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <!-- Background waveform (silence) -->
        <path 
            d="M4 12h16"
            :stroke="color"
            stroke-width="1"
            stroke-linecap="round"
            opacity="0.2"
        />

        <!-- Active waveform -->
        <path 
            d="M8 12C8 12 9 8 10 8C11 8 11.5 16 12 16C12.5 16 13 8 14 8C15 8 16 12 16 12"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
        />

        <!-- Left trim marker -->
        <path 
            d="M7 7V17M7 7L9 9M7 7L5 9"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />

        <!-- Right trim marker -->
        <path 
            d="M17 7V17M17 17L19 15M17 17L15 15"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
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