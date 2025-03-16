import { onMounted, onUnmounted, type Ref } from "vue";

export const useClickOutside = (element: Ref<HTMLElement | null>, callback: () => void) => {
    const handleClick = (event: MouseEvent) => {
        if (element.value && !element.value.contains(event.target as Node)) {
            callback();
        }
    };
    onMounted(() => {
        document.addEventListener('click', handleClick);
    });
    onUnmounted(() => {
        document.removeEventListener('click', handleClick);
    });
}