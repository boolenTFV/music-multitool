import { useAudioContext } from "@/composables/useAudioContext";
import { ref } from "vue";

export const useGainEnvelope = () => {
    const audioContext = useAudioContext();
    const gain = ref(1);
    const gainNode = audioContext.value.createGain();
    const connect = (source: AudioNode) => {
        source.connect(gainNode);
    };

    const connectToDestination = () => {
        gainNode.connect(audioContext.value.destination);
    };

    /**
     * Attack the gain envelope
     * 
     * @param attackTimeMs time in milliseconds to attack the gain
     */
    const attack = (attackTimeMs: number) => {
        const attackTimeSeconds = attackTimeMs / 1000;
        gainNode.gain.cancelScheduledValues(audioContext.value.currentTime);
        gainNode.gain.setTargetAtTime(gain.value, audioContext.value.currentTime + attackTimeSeconds, attackTimeSeconds / 2);
    };

    /**
     * Release the gain envelope
     * 
     * @param releaseTimeMs time in milliseconds to release the gain
     * @returns time when the release will end
     */
    const release = (releaseTimeMs: number) => {
        const releaseTimeSeconds = releaseTimeMs / 1000;
        gainNode.gain.cancelScheduledValues(audioContext.value.currentTime);
        gainNode.gain.setTargetAtTime(0, audioContext.value.currentTime + releaseTimeSeconds, releaseTimeSeconds / 2);
        return audioContext.value.currentTime + releaseTimeSeconds;
    };

    return {
        gainNode,
        gain,
        attack,
        release,
        connect,
        connectToDestination
    };
}; 