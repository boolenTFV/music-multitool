import { copyDOMRect } from "@/utils/copyDOMRect";
import { onMounted, onUnmounted, reactive, watch, type Ref } from "vue";

export const useElementRect = (elementRef: Ref<Element | undefined | null>) => {
  const rect = reactive<{
    x: number,
    y: number,
    width: number,
    height: number,
    top: number,
    left: number,
    right: number,
    bottom: number
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });

  let observer: ResizeObserver | undefined;

  const startObserving = (el: Element) => {
    console.log(el.getBoundingClientRect())
    Object.assign(rect, copyDOMRect(el.getBoundingClientRect()));
    observer = new ResizeObserver(() => {
      Object.assign(rect, copyDOMRect(el.getBoundingClientRect()));
    });
    observer.observe(el);
  };

  onMounted(() => {
    if (elementRef.value) {
      startObserving(elementRef.value);
    }
  });

  watch(elementRef, (el) => {
    observer?.disconnect();
    if (el) {
      startObserving(el);
    }
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return rect;
};