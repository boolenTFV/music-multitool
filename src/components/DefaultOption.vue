<template>
    <div :class="$style.container"><slot></slot></div>
</template>
<style lang="scss" module>
.container {
    padding: 10px;
    cursor: pointer;
    &:hover {
        background-color: var(--hover-color);
    }
}
</style>