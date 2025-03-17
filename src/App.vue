<template>
  <DefaultLayout>
    <VerticalList align="start">
      <div :class="$style.container">
        <MetronomeModule v-if="isMetronomeVisible" :class="$style.metronome" />
        <LooperModule v-if="isLooperVisible" :class="$style.looper"/>
        <ChordsSequencerModule v-if="isChordSequencerVisible" :class="$style.chordsSequencer"/>
        <PianoModule v-if="isPianoVisible" :class="$style.piano"/>
      </div>
      <HorizontalList :class="$style.controls">
          <DefaultButton @click="isMetronomeVisible = !isMetronomeVisible" :type="isMetronomeVisible ? 'primary' : 'secondary'">
            <MetronomeIcon />
            Metronome
          </DefaultButton>
          <DefaultButton :type="isLooperVisible ? 'primary' : 'secondary'" @click="isLooperVisible = !isLooperVisible">
            <LooperIcon /> Looper
          </DefaultButton>
          <DefaultButton @click="isChordSequencerVisible = !isChordSequencerVisible" :type="isChordSequencerVisible ? 'primary' : 'secondary'">
            <ChordSequencerIcon />
            Chord Sequence
          </DefaultButton>
          <DefaultButton :type="isPianoVisible ? 'primary' : 'secondary'" @click="isPianoVisible = !isPianoVisible">
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
import { ref } from 'vue';
import DefaultButton from './components/DefaultButton.vue';
import PianoIcon from './components/Icons/PianoIcon.vue';
import ChordSequencerIcon from './components/Icons/ChordSequencerIcon.vue';
import MetronomeIcon from './components/Icons/MetronomeIcon.vue';
import LooperIcon from './components/Icons/LooperIcon.vue';

const isMetronomeVisible = ref(true);
const isLooperVisible = ref(true);
const isPianoVisible = ref(false);
const isChordSequencerVisible = ref(false);
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
.looper {
  grid-column: span 4;
  grid-row: span 2;
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
  .looper {
    grid-column: span 2;
    grid-row: span 1;
  }
}
.controls {
  flex-wrap: wrap;
}
</style>
