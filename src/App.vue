<template>
  <DefaultLayout>
    <VerticalList align="start">
      <div :class="$style.container">
        <MetronomeModule v-if="isMetronome" :class="$style.metronome" />
        <LooperModule v-for="i in loppersCount" :key="i" :class="$style.looper"/>
        <ChordsSequencerModule v-if="isChordSequencer" :class="$style.chordsSequencer"/>
        <PianoModule v-if="isPiano" :class="$style.piano"/>
      </div>
      <HorizontalList :class="$style.controls">
          <DefaultButton @click="loppersCount++" :disabled="loppersCount >= 8" square>+</DefaultButton>
          <DefaultButton @click="loppersCount--" :disabled="loppersCount <= 1" square>-</DefaultButton>
          <DefaultButton @click="playAll" square><PlayIcon :size="24"/></DefaultButton>
          <DefaultButton @click="stopAll" square><StopIcon /></DefaultButton>
          <DefaultButton @click="clearAll" square><ClearIcon /></DefaultButton>
          <DefaultButton @click="isMetronome = !isMetronome" :type="isMetronome ? 'primary' : 'secondary'">
            <MetronomeIcon />
            Metronome
          </DefaultButton>
          <DefaultButton @click="isChordSequencer = !isChordSequencer" :type="isChordSequencer ? 'primary' : 'secondary'">
            <ChordSequencerIcon />
            Chord Sequence
          </DefaultButton>
          <DefaultButton :type="isPiano ? 'primary' : 'secondary'" @click="isPiano = !isPiano">
            <PianoIcon /> Synth
          </DefaultButton>
      </HorizontalList>
    </VerticalList>
  </DefaultLayout>
</template>

<script setup lang="ts">
import HorizontalList from '@/components/HorizontalList.vue';
import LooperModule from '@/components/Modules/LooperModule.vue';
import MetronomeModule from '@/components/Modules/MetronomeModule.vue';
import PianoModule from './components/Modules/PianoModule.vue';
import ChordsSequencerModule from './components/Modules/ChordsSequencerModule.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import VerticalList from '@/components/VerticalList.vue';
import { CLEAR_EVENT, looperEventTarget, PLAY_EVENT, STOP_EVENT } from '@/eventTargets/looperEventTarget';
import { ref } from 'vue';
import DefaultButton from './components/DefaultButton.vue';
import PlayIcon from './components/Icons/PlayIcon.vue';
import StopIcon from './components/Icons/StopIcon.vue';
import ClearIcon from './components/Icons/ClearIcon.vue';
import PianoIcon from './components/Icons/PianoIcon.vue';
import ChordSequencerIcon from './components/Icons/ChordSequencerIcon.vue';
import MetronomeIcon from './components/Icons/MetronomeIcon.vue';
const isMetronome = ref(true);
const loppersCount = ref(8);
const isPiano = ref(false);
const isChordSequencer = ref(false);


function playAll() {
  looperEventTarget.dispatchEvent(new Event(PLAY_EVENT))
}
function stopAll() {
  looperEventTarget.dispatchEvent(new Event(STOP_EVENT))
}
function clearAll() {
  looperEventTarget.dispatchEvent(new Event(CLEAR_EVENT))
}
</script>

<style lang="scss" module>
.container {
  display: grid;
  width: 100%;
  gap: 8px;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-auto-rows: minmax(200px, auto);
  position: relative;
  z-index: 2;
}
.metronome {
  grid-column: span 2;
  grid-row: span 2;
}
.piano {
  grid-column: span 6;
  grid-row: span 2;
}
.chordsSequencer {
  grid-column: span 6;
  grid-row: span 1;
  z-index: 2;
}
@media screen and (max-width: 800px) {
  .container {
    grid-template-columns: 1fr 1fr;
  }
  .piano {
    grid-column: span 2;
    grid-row: span 2;
  }
  .chordsSequencer {
    grid-column: span 2;
    grid-row: span 2;
  }
}
.controls {
  flex-wrap: wrap;
}
</style>
