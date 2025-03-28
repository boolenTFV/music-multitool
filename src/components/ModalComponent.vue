<template>
    <teleport to="body">
    <div :class="[$style.modal]">
        <div :class="[$style.modalContent, fullscreen && $style.fullscreen]">
            <DefaultButton :class="$style.closeButton" @click="closeModal" square title="Close modal"><CloseIcon /></DefaultButton>
            <h2 :class="$style.modalHeader">
                <slot name="header" />
            </h2>
            <div :class="$style.modalBody"><slot/></div>
            <div :class="$style.modalFooter"><slot name="footer" /></div>
        </div>
        </div>
    </teleport>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import DefaultButton from '@/components/DefaultButton.vue';
import CloseIcon from '@/components/Icons/CloseIcon.vue';
defineProps<{
    fullscreen?: boolean
}>()
const emit = defineEmits<{
    (e: 'closeModal'): void
}>()
const closeModal = () => {
    emit('closeModal');
}
onMounted(() => {
    document.body.style.overflow = 'hidden';
})
onUnmounted(() => {
    document.body.style.overflow = 'auto';
})
</script>
<style lang="scss" module>
.modal {
    z-index: 10000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(10px);
} 
.modalContent {
    position: relative;
    background-color: var(--background-color);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    min-width: 325px - 40px;
}
.modalHeader {
    font-size: 24px;
    font-weight: bold;
    width: calc(100% - 40px);
    margin-top: 0;
}
.modalBody {
    margin-top: 20px;
    overflow-y: auto;
    max-height: calc(100vh - 100px);
}
.modalFooter {
    margin-top: 20px;
}
.closeButton {
    position: absolute;
    top: 10px;
    right: 10px;
}
.fullscreen {
    height: calc(100dvh - 40px);
    width: calc(100dvw - 40px);
}
</style>