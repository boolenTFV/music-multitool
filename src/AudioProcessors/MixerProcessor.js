// mixer-processor.js
class MixerProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
    }
  
    process(inputs, outputs) {
      const output = outputs[0];
  
      // Clear the output buffer
      for (let channel = 0; channel < output.length; channel++) {
        output[channel].fill(0);
      }
  
      // Mix all inputs into the output
      for (let inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
        const input = inputs[inputIndex];
        for (let channel = 0; channel < input.length; channel++) {
          for (let sample = 0; sample < input[channel].length; sample++) {
            output[channel][sample] += input[channel][sample] / inputs.length;
          }
        }
      }
      return true; // Keep the processor alive
    }
  }
  
  registerProcessor('mixer-processor', MixerProcessor);
  