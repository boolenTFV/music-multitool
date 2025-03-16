<template>
    <div :class="$style.container">
        <h3 :class="$style.heading"><slot name="heading" /></h3>
        <slot />
    </div>
</template>
<style lang="scss" module>
.heading {
    margin: 0 0 16px;
}
.container {
    padding: 16px 16px;
    border-radius: 3px;
    background-color: var(--block-color);
    backdrop-filter: blur(10px);

}
</style>