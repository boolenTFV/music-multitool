import { watch, type Ref } from "vue";

const useDelayedWatch = (value: Ref, cb: CallableFunction, delay: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    watch(value, () => {
        if(timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb();
        }, delay);
    });
}

export default useDelayedWatch;