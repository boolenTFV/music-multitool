<template>
    <svg 
        :class="$style.icon" 
        :width="size" 
        :height="size" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <!-- Outer circle -->
        <circle
            cx="12"
            cy="12"
            r="8"
            :stroke="color"
            stroke-width="1.5"
            opacity="0.3"
        />

        <!-- Loop path -->
        <path 
            d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />

        <!-- Loop connection -->
        <path 
            d="M12 20L12 4"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />

        <!-- Recording indicator -->
        <circle
            cx="12"
            cy="12"
            r="2"
            :fill="color"
            opacity="0.8"
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