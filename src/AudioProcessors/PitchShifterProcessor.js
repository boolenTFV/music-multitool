class PitchShifterProcessor extends AudioWorkletProcessor {
  pitchRatio;
  phase;
  phaseIncrement;
  bufferSize;
  buffer;
  bufferIndex;
  lastOutput;

  static get parameterDescriptors() {
    return [
      {
        name: "pitchRatio",
        defaultValue: 0, // Perfect pitch
        minValue: -10,
        maxValue: 10,
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
    this.lastOutput = 0;
  }

  process(inputs, outputs, parameters) {
    const pitchRatio = parameters.pitchRatio[0];
    const input = inputs[0];
    const output = outputs[0];
    
    if (input.length > 0) {
      const inputChannel = input[0];
      const outputChannel = output[0];

      for (let i = 0; i < inputChannel.length; i++) {
        // Write to buffer
        this.buffer[this.bufferIndex] = inputChannel[i];
        this.bufferIndex = (this.bufferIndex + 1) % this.bufferSize;

        // Calculate phase increment with smoothing
        this.phaseIncrement = (this.bufferSize / (this.bufferSize - 1)) * pitchRatio;

        // Calculate read position with phase
        const readPosition = (this.bufferIndex - this.phase + this.bufferSize) % this.bufferSize;
        
        // Get integer and fractional parts
        const readIndexFloor = Math.floor(readPosition);
        const readIndexCeil = (readIndexFloor + 1) % this.bufferSize;
        const frac = readPosition - readIndexFloor;

        // Linear interpolation
        const sampleFloor = this.buffer[readIndexFloor];
        const sampleCeil = this.buffer[readIndexCeil];
        const interpolatedSample = sampleFloor + frac * (sampleCeil - sampleFloor);

        // Smooth transition between old and new output
        const smoothingFactor = 0.96;
        const smoothedOutput = this.lastOutput * smoothingFactor + interpolatedSample * (1 - smoothingFactor);

        // Update output
        outputChannel[i] = smoothedOutput;
        this.lastOutput = smoothedOutput;

        // Update phase
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