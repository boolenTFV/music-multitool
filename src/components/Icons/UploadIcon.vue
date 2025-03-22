<template>
    <svg 
        :class="$style.icon" 
        :width="size" 
        :height="size" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <!-- Document -->
        <path 
            d="M6 4H18V20H6V4Z"
            :stroke="color"
            stroke-width="1.5"
            rx="1"
        />

        <!-- Document lines -->
        <path 
            d="M8 8H16M8 12H16M8 16H14"
            :stroke="color"
            stroke-width="1"
            opacity="0.5"
            stroke-linecap="round"
        />

        <!-- Upload arrow -->
        <path 
            d="M12 4V12M12 4L8 8M12 4L16 8"
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