<template>
    <div :class="[$style.flex_list, justifyClass, alignClass]">
        <slot />
    </div>
</template>
<script setup lang="ts">
import { computed, useCssModule } from 'vue';
const style = useCssModule()
const props = withDefaults(defineProps<{
    gap?: string,
    align?: 'start' | 'center' | 'end',
    justify?: 'start' | 'center' | 'end' | 'stretch'
}>(), {
    gap: "8px"
})
const justifyClass = computed(() => props.justify ? style[`justify_${props.justify}`] : '')
const alignClass = computed(() => props.align ? style[`align_${props.align}`] : '')
</script>
<style module>
.flex_list {
    display: flex;
    flex-direction: column;
    gap: v-bind(gap);
}
.align_start {
    align-items: flex-start;
}
.align_center {
    align-items: center;
}
.align_end {
    align-items: flex-end;
}
.justify_start {
    justify-content: flex-start;
}
.justify_center {
    justify-content: center;
}
.justify_end {
    justify-content: flex-end;
}
.justify_stretch {
    justify-content: stretch;
}
</style>