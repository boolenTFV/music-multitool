<template>
    <div :class="$style.modal">
        <div :class="$style.modalContent">
            <DefaultButton :class="$style.closeButton" @click="closeModal" square><CloseIcon /></DefaultButton>
            <h2 :class="$style.modalHeader">
                <slot name="header" />
            </h2>
            <div :class="$style.modalBody"><slot name="body" /></div>
            <div :class="$style.modalFooter"><slot name="footer" /></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import DefaultButton from './DefaultButton.vue';
import CloseIcon from './Icons/CloseIcon.vue';
const emit = defineEmits<{
    (e: 'closeModal'): void
}>()
const closeModal = () => {
    emit('closeModal');
}
</script>
<style lang="scss" module>
.modal {
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
    min-width: 450px;
}
.modalHeader {
    font-size: 24px;
    font-weight: bold;
    width: calc(100% - 40px);
    margin-top: 0;
}
.modalBody {
    margin-top: 20px;
}
.modalFooter {
    margin-top: 20px;
}
.closeButton {
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>