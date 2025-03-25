import { reactive, type Ref, ref} from "vue";
import { useAudioContext } from "./useAudioContext";

export const useCanvasSelectLogic = (canvasRef: Ref<HTMLCanvasElement | undefined, HTMLCanvasElement | undefined>, audioBuffer?: Ref<AudioBuffer | undefined>) => {
    const audioContext = useAudioContext();
    const range = reactive({
        selectedXStart: 0,
        selectedXEnd: 0,
        selectedTimeStart: 0,
        selectedTimeEnd: 0
    })
    const selectedAudioBuffer = ref<AudioBuffer>();
    const getSelectedAudioBuffer = () => {
        if(!audioBuffer?.value) return;
        const start = Math.round(audioBuffer.value.sampleRate * range.selectedTimeStart);
        const end = Math.round(audioBuffer.value.sampleRate * range.selectedTimeEnd);
        const audioData = audioBuffer.value.getChannelData(0);
        const newAudioData = audioData.slice(start, end);
        console.log(newAudioData.length);
        const newAudioBuffer = audioContext.value.createBuffer(1, newAudioData.length, audioBuffer.value.sampleRate);
        newAudioBuffer.copyToChannel(newAudioData, 0);
        console.log(newAudioBuffer.duration);
        return newAudioBuffer;
    }
    const handleMouseDown = (event: MouseEvent) => {
        if (!canvasRef.value || !audioBuffer?.value) return;
        const rect = canvasRef.value.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const timeStep = audioBuffer.value.duration / canvasRef.value.width;
        range.selectedXStart = x;
        range.selectedTimeStart = range.selectedXStart * timeStep;
    }
    const handleMouseUp = (event: MouseEvent) => {
        if (!canvasRef.value || !audioBuffer?.value) return;
        const rect = canvasRef.value.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const timeStep = audioBuffer.value.duration / canvasRef.value.width;
        range.selectedXEnd = x;
        range.selectedTimeEnd = range.selectedXEnd * timeStep;
        console.log(range.selectedTimeEnd, range.selectedTimeStart);
        selectedAudioBuffer.value = getSelectedAudioBuffer();
    }
    
    return {
        range,
        selectedAudioBuffer,
        handleMouseDown,
        handleMouseUp,
    }
}