<template>
    <div :class="$style.flex_list">
        <slot />
    </div>
</template>
<style module>
.flex_list {
    display: flex;
    flex-direction: row;
    gap: 5px;
}
</style>