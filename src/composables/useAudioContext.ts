import { readonly, ref } from "vue";

const audioContextRef = ref(new AudioContext());

export const useAudioContext = () => readonly(audioContextRef);