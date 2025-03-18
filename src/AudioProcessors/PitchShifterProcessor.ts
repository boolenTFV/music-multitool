/// <reference lib="dom" />
/// <reference lib="webworker" />

declare class AudioWorkletProcessor {
    readonly port: MessagePort;
    process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean;
}

declare function registerProcessor(name: string, processorCtor: typeof AudioWorkletProcessor): void;

class PitchShifterProcessor extends AudioWorkletProcessor {
  private pitchRatio: number;
  private phase: number;
  private phaseIncrement: number;
  private bufferSize: number;
  private buffer: Float32Array;
  private bufferIndex: number;

  constructor() {
    super();
    this.pitchRatio = 0.5; // Default pitch shift factor
    this.phase = 0;
    this.phaseIncrement = 0;
    this.bufferSize = 1024;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;

    this.port.onmessage = (event) => {
      if (event.data.pitchRatio) {
        this.pitchRatio = event.data.pitchRatio;
      }
    };
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
    const input = inputs[0];
    const output = outputs[0];

    if (input.length > 0) {
      const inputChannel = input[0];
      const outputChannel = output[0];

      for (let i = 0; i < inputChannel.length; i++) {
        this.buffer[this.bufferIndex] = inputChannel[i];
        this.bufferIndex = (this.bufferIndex + 1) % this.bufferSize;

        this.phaseIncrement = (this.bufferSize / (this.bufferSize - 1)) * this.pitchRatio;

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