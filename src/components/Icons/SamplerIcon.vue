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
            x="2" 
            y="2" 
            width="20" 
            height="20" 
            rx="2" 
            :stroke="color" 
            stroke-width="2"
            fill="none"
        />
        <path 
            d="M2 8H22" 
            :stroke="color" 
            stroke-width="2"
        />
        <path 
            d="M2 14H22" 
            :stroke="color" 
            stroke-width="2"
        />
        <path 
            d="M8 2V22" 
            :stroke="color" 
            stroke-width="2"
        />
        <path 
            d="M14 2V22" 
            :stroke="color" 
            stroke-width="2"
        />
        <path 
            d="M20 2V22" 
            :stroke="color" 
            stroke-width="2"
        />
        <path 
            d="M6 2V22" 
            :stroke="color" 
            stroke-width="2"
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