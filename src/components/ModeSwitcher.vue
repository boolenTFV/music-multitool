<template>
    <div>
        <div :class="$style.track">
        </div>
    </div>
</template>
<script lang="ts" setup>
const value = defineModel()
defineProps<{
    options: string
}>()
</script>
<style module>
.container {

}
.track {

}
</style>