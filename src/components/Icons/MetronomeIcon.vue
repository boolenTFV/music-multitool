<template>
    <svg 
        :class="$style.icon" 
        :width="size" 
        :height="size" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <!-- Base -->
        <path 
            d="M6 20H18L19 21H5L6 20Z"
            :fill="color"
            opacity="0.8"
        />
        
        <!-- Metronome body -->
        <path 
            d="M7 20H17L19 5H5L7 20Z"
            opacity="0.4"
            :fill="color"
        />

        <!-- Scale lines -->
        <path
            d="M8 8H16M8 12H16M8 16H16"
            :stroke="color"
            stroke-width="0.75"
            opacity="0.3"
            stroke-linecap="round"
        />

        <!-- Pendulum rod -->
        <path 
            d="M12 7V17"
            :stroke="color"
            stroke-width="0.75"
            opacity="0.3"
        />

        <!-- Pendulum -->
        <path 
            d="M12 7L15 17"
            :stroke="color"
            stroke-width="2"
            stroke-linecap="round"
        />

        <!-- Pivot point -->
        <circle
            cx="12"
            cy="7"
            r="1"
            :fill="color"
        />

        <!-- Weight rod -->
        <path 
            d="M9 10H15"
            :stroke="color"
            stroke-width="2"
            opacity="0.8"
        />

        <!-- Sliding weight -->
        <path
            d="M11 9H13V11H11V9Z"
            :fill="color"
        />

        <!-- Top -->
        <path
            d="M5 5H19L18 3H6L5 5Z"
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