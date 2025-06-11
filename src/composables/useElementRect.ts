import { computed, type Ref } from "vue";

export const useElementRect = (elementRef: Ref<Element|undefined|null>) => {
const rect = computed(() => {
    if(!elementRef.value) return {x: 0, y:0, width: 0, height: 0};
    return elementRef.value.getBoundingClientRect();
})

return rect;
}