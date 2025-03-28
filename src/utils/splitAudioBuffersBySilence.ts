import { trimSilence } from "./trimSilence";

/**
 * Trims silence from the beginning and end of an AudioBuffer.
 */
export function splitAudioBuffersBySilence(audioBuffer: AudioBuffer, silenceThreshold = 0.005) {
    const samples = audioBuffer.getChannelData(0); // Get the first channel (mono)
    const sampleRate = audioBuffer.sampleRate;
    const chunks: number[][] = [];
    const audioBuffers: AudioBuffer[] = [];
    const audioContext = new AudioContext();
    const windowSize = 2500;

    let isLastSilence = true;
    for(let cursor = 0; cursor < samples.length; cursor++) {
      const allSilence = everyInWindow(samples, cursor, windowSize, (sample) => isSilence(sample, silenceThreshold));
      if(allSilence) {
        isLastSilence = true;
      } else {
        if(isLastSilence) {
          chunks.push([]);
        }
        chunks[chunks.length - 1].push(samples[cursor]);
        isLastSilence = false;
      }
    }
    for(let i = 0; i < chunks.length; i++) {
      if(chunks[i].length > 2000) {
        const newChunkBuffer = audioContext.createBuffer(
          audioBuffer.numberOfChannels,
          chunks[i].length,
          sampleRate
        );
        copyChunkToBuffer(chunks[i], newChunkBuffer);
        const newChunkBufferTrimmed = trimSilence(newChunkBuffer);
        if(newChunkBufferTrimmed.duration > 0.08) {
          audioBuffers.push(newChunkBufferTrimmed)
        }
      }
    }
    return audioBuffers;
  }

function isSilence(sample: number, threshold: number) {
  return Math.abs(sample) < threshold;
}
function everyInWindow(samples: Float32Array<ArrayBufferLike>, windowStart: number, windowSize: number, cb: (sample: number) => boolean) {
  const windowEnd = Math.min(windowStart + windowSize, samples.length);
  const window = samples.slice(windowStart, windowEnd);
  return window.every(cb);
}
const copyChunkToBuffer = (chunk: number[], newAudioBuffer: AudioBuffer) => {
    const newChannelData = newAudioBuffer.getChannelData(0);
    for (let i = 0; i < newAudioBuffer.length; i++) {
      newChannelData[i] = chunk[i];
    }
}