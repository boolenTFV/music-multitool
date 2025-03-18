/**
 * Trims silence from the beginning and end of an AudioBuffer.
 */
export function trimSilence(audioBuffer: AudioBuffer, silenceThreshold = 0.01) {
    const samples = audioBuffer.getChannelData(0); // Get the first channel (mono)
    const sampleRate = audioBuffer.sampleRate;
  
    // Find the start of non-silence
    const startIndex = samples.findIndex((sample) => {
        return Math.abs(sample) > silenceThreshold
    })
    if(startIndex === -1) return audioBuffer;
  
    // Find the end of non-silence
    let endIndex = samples.length - 1;
    for (let i = samples.length - 1; i >= 0; i--) {
      if (Math.abs(samples[i]) > silenceThreshold) {
        endIndex = i;
        break;
      }
    }
  
    // Calculate the duration of the trimmed audio
    const trimmedLength = endIndex - startIndex + 1;
    const trimmedDuration = trimmedLength / sampleRate;
    console.log(`Trimmed duration: ${trimmedDuration} seconds`);
    // Create a new AudioBuffer for the trimmed audio
    const trimmedBuffer = new AudioContext().createBuffer(
      audioBuffer.numberOfChannels,
      trimmedLength,
      sampleRate
    );
  
    // Copy the non-silent portion to the new buffer
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const trimmedData = trimmedBuffer.getChannelData(channel);
      for (let i = 0; i < trimmedLength; i++) {
        trimmedData[i] = channelData[startIndex + i];
      }
    }
  
    return trimmedBuffer;
  }
  