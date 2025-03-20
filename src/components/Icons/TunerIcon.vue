<template>
    <svg 
        :class="$style.icon" 
        :width="size" 
        :height="size" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <!-- Tuner body -->
        <path 
            d="M4 6H20V18H4V6Z"
            :stroke="color"
            stroke-width="1.5"
            rx="1"
        />

        <!-- Scale marks -->
        <path 
            d="M6 12H18M6 12V14M18 12V14M12 12V14"
            :stroke="color"
            stroke-width="1"
            opacity="0.5"
        />

        <!-- Needle -->
        <path 
            d="M12 12L12 8"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
        />

        <!-- Needle head -->
        <path 
            d="M12 8L10 10M12 8L14 10"
            :stroke="color"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />

        <!-- Frequency display -->
        <path 
            d="M8 16H16V18H8V16Z"
            :stroke="color"
            stroke-width="1"
            opacity="0.3"
            rx="0.5"
        />

        <!-- Display segments -->
        <path 
            d="M9 17H11M13 17H15"
            :stroke="color"
            stroke-width="1"
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