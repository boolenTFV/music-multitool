import { ref } from "vue";

export const useStopwatch = (step: number = 0.05) => {
    const callbacks = ref<((time: number) => void)[]>([]);
    const time = ref(0);
    const isRunning = ref(false);
    const interval = ref<number>();
    const start = () => {
        isRunning.value = true;
        interval.value = setInterval(() => {
            time.value = time.value + step;
            callbacks.value.forEach((callback) => callback(time.value));
        }, step * 1000);
    }
    const stop = () => {
        isRunning.value = false;
        clearInterval(interval.value);
    }
    const reset = () => {
        time.value = 0;
        clearInterval(interval.value);
    }
    const onUpdate = (callback: (time: number) => void) => {
        callbacks.value.push(callback);
    };
    return { time, isRunning, start, stop, reset, onUpdate };
}
