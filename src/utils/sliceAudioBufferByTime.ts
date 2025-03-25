export const sliceAudioBufferByTime = (audioBuffer: AudioBuffer, start: number, end: number) => {
    const sampleRate = audioBuffer.sampleRate;
    const startSample = Math.floor(start * sampleRate);
    const endSample = Math.floor(end * sampleRate);
    const slicedBufferData = audioBuffer.getChannelData(0).slice(startSample, endSample);
    const slicedBuffer = new AudioBuffer({
        sampleRate: audioBuffer.sampleRate,
        length: slicedBufferData.length,
        numberOfChannels: 1
    });
    slicedBuffer.copyToChannel(slicedBufferData, 0);
    return slicedBuffer;
}