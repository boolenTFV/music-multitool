<template>
    <svg 
        :class="$style.icon" 
        :width="size" 
        :height="size" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <!-- White keys and frame -->
        <path 
            d="M4 4H20V20H4V4ZM5.5 5.5V13H8V18.5H9.5V13H11V5.5H5.5ZM12.5 5.5V13H14.5V18.5H16V13H18.5V5.5H12.5Z"
            :fill="color"
            stroke="none"
        />
        <!-- Black keys -->
        <path 
            d="M7 5.5H9.5V11.5H7V5.5ZM14.5 5.5H17V11.5H14.5V5.5Z"
            fill="currentColor"
            fill-opacity="0.2"
            stroke="none"
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