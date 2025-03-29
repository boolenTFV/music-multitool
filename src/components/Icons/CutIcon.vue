<template>
    <svg 
    :class="$style.icon" 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
>
    <!-- Left blade -->
    <path 
        d="M6.5 3L10.5 8L8 9.5L6.5 3Z" 
        :fill="color"
    />
    <!-- Right blade -->
    <path 
        d="M17.5 3L13.5 8L16 9.5L17.5 3Z" 
        :fill="color"
    />
    <!-- Left handle ring (outer) - moved right -->
    <path 
        d="M9 14C9 16.2091 7.20914 18 5 18C2.79086 18 1 16.2091 1 14C1 11.7909 2.79086 10 5 10C7.20914 10 9 11.7909 9 14Z" 
        :fill="color"
        transform="translate(2 0)"
    />
    <!-- Left handle ring (inner) - moved right -->
    <path 
        d="M7 14C7 15.1046 6.10457 16 5 16C3.89543 16 3 15.1046 3 14C3 12.8954 3.89543 12 5 12C6.10457 12 7 12.8954 7 14Z" 
        fill="white"
        transform="translate(2 0)"
    />
    <!-- Right handle ring (outer) - moved left -->
    <path 
        d="M23 14C23 16.2091 21.2091 18 19 18C16.7909 18 15 16.2091 15 14C15 11.7909 16.7909 10 19 10C21.2091 10 23 11.7909 23 14Z" 
        :fill="color"
        transform="translate(-2 0)"
    />
    <!-- Right handle ring (inner) - moved left -->
    <path 
        d="M21 14C21 15.1046 20.1046 16 19 16C17.8954 16 17 15.1046 17 14C17 12.8954 17.8954 12 19 12C20.1046 12 21 12.8954 21 14Z" 
        fill="white"
        transform="translate(-2 0)"
    />
    <!-- Connector between blades and handles - made narrower -->
    <path 
        d="M11.5 9H12.5V14H11.5V9Z" 
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