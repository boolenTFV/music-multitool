<template>
    <div :class="$style.centered_items">
        <slot />
    </div>
</template>
<style module>
.centered_items {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}
</style>