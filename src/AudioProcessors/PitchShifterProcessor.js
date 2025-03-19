class PitchShifterProcessor extends AudioWorkletProcessor {
  pitchRatio;
  phase;
  phaseIncrement;
  bufferSize;
  buffer;
  bufferIndex;

  static get parameterDescriptors() {
    return [
      {
        name: "pitchRatio",
        defaultValue: 0.1,
        minValue: -1,
        maxValue: 1,
        automationRate: "k-rate",
      },
    ];
  }

  constructor() {
    super();
    this.phase = 0;
    this.phaseIncrement = 0;
    this.bufferSize = 1024;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const pitchRatio = parameters.pitchRatio;
    const input = inputs[0];
    const output = outputs[0];
    
    if (input.length > 0) {
      const inputChannel = input[0];
      const outputChannel = output[0];

      for (let i = 0; i < inputChannel.length; i++) {
        this.buffer[this.bufferIndex] = inputChannel[i];
        this.bufferIndex = (this.bufferIndex + 1) % this.bufferSize;

        this.phaseIncrement = (this.bufferSize / (this.bufferSize - 1)) * pitchRatio;

        const readIndex = (this.bufferIndex - this.phase + this.bufferSize) % this.bufferSize;
        outputChannel[i] = this.buffer[Math.floor(readIndex)];

        this.phase += this.phaseIncrement;
        if (this.phase >= this.bufferSize) {
          this.phase -= this.bufferSize;
        }
      }
    }

    return true;
  }
}

registerProcessor('pitch-shifter-processor', PitchShifterProcessor);