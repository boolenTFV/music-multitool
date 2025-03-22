<template>
    <label :class="$style.container">
        <input :class="$style.input" type="file" @change="handleFileChange" ref="fileInput"/>
        <span
            :class="$style.label"
            :title="fileInput?.files?.[0]?.name ? fileInput.files[0].name : 'Upload'"
            @click="clear"
            square
            accept="audio/*"
        >
            <template v-if="!isFileLoaded"><UploadIcon /></template>
            <template v-else><FileIcon /></template>
        </span>
        
    </label>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UploadIcon from '@/components/Icons/UploadIcon.vue';
import FileIcon from '@/components/Icons/FileIcon.vue';
const fileInput = ref<HTMLInputElement>();
const emit = defineEmits<{
    (e: 'change', file: File): void
}>();
const isFileLoaded = ref(false);
const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if(!file) return;
    isFileLoaded.value = true;
    emit('change', file);
}
const clear = () => {
    if(!fileInput.value) return;
    fileInput.value.value = '';
    isFileLoaded.value = false;
}

defineExpose({
    clear
})
</script>
<style lang="scss" module>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}   
.input {
    display: none;
    &:focus {
        outline: none;
    }
}

.label {
    background-color: var(--button-primary-bg);
    border-radius: var(--button-border-radius);
    border: none;
    box-sizing: border-box;
    color: var(--button-text-color);
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin: 0;
    padding: 0;
    outline: none;
    overflow: hidden;
    padding: 0;
    height: 44px;
    width: 44px;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    transition: all 0.2s ease;

    &:hover:not(.disabled) {
        background-color: var(--button-primary-hover);
        transform: translateY(-1px);
    }

    &:active:not(.disabled) {
        background-color: var(--button-primary-active);
        transform: translateY(0);
    }

    &.disabled {
        background-color: var(--button-disabled-bg);
        color: var(--button-disabled-color);
        cursor: not-allowed;
        transform: none;
    }

}

</style>