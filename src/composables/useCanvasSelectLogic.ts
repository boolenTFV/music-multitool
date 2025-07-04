import { reactive, type Ref, ref} from "vue";
import { useAudioContext } from "./useAudioContext";
import { getElementClickCoordinates } from "@/utils/getElementClickCoordinates";

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
        const newAudioBuffer = audioContext.value.createBuffer(1, newAudioData.length, audioBuffer.value.sampleRate);
        newAudioBuffer.copyToChannel(newAudioData, 0);
        return newAudioBuffer;
    }
    const handleMouseDown = (event: MouseEvent) => {
        if (!canvasRef.value || !audioBuffer?.value) return;
        const {x} = getElementClickCoordinates(event, canvasRef.value);
        const timeStep = audioBuffer.value.duration / canvasRef.value.width;
        range.selectedXStart = x;
        range.selectedTimeStart = range.selectedXStart * timeStep;
    }
    const handleMouseUp = (event: MouseEvent) => {
        if (!canvasRef.value || !audioBuffer?.value) return;
        const {x} = getElementClickCoordinates(event, canvasRef.value);
        const timeStep = audioBuffer.value.duration / canvasRef.value.width;
        range.selectedXEnd = x;
        range.selectedTimeEnd = range.selectedXEnd * timeStep;
        selectedAudioBuffer.value = getSelectedAudioBuffer();
    }
    
    return {
        range,
        selectedAudioBuffer,
        handleMouseDown,
        handleMouseUp,
    }
}