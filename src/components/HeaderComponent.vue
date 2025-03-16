<template>
    <header :class="$style.header">
        <slot></slot>
    </header>
</template>
<style lang="scss" module>
.header {
    background-color: var(--primary-dark-color);
    box-shadow: 2px 0px 10px var(--primary-color);
    :global(h1),:global(h2),:global(h3) {
        color: white;
    }
}
</style>