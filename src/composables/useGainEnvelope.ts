import { ref } from "vue";

export const useGainEnvelope = (audioContext: AudioContext) => {
    const gain = ref(1);
    const gainNode = audioContext.createGain();
    const connect = (source: AudioNode) => {
        source.connect(gainNode);
    };

    /**
     * Attack the gain envelope
     * 
     * @param attackTimeMs time in milliseconds to attack the gain
     */
    const attack = (attackTimeMs: number) => {
        const attackTimeSeconds = attackTimeMs / 1000;
        gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        gainNode.gain.setTargetAtTime(gain.value, audioContext.currentTime + attackTimeSeconds, attackTimeSeconds / 2);
    };

    /**
     * Release the gain envelope
     * 
     * @param releaseTimeMs time in milliseconds to release the gain
     * @returns time when the release will end
     */
    const release = (releaseTimeMs: number) => {
        const releaseTimeSeconds = releaseTimeMs / 1000;
        gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        gainNode.gain.setTargetAtTime(0, audioContext.currentTime + releaseTimeSeconds, releaseTimeSeconds / 2);
        return audioContext.currentTime + releaseTimeSeconds;
    };

    return {
        gainNode,
        gain,
        attack,
        release,
        connect
    };
}; 