<template>
    <div :class="$style.switch">
        <label :class="$style.label">
            <input 
                type="checkbox" 
                :class="$style.checkbox"
                v-model="modelValue" 
                :disabled="disabled"
            />
            <span :class="$style.button"></span>
        </label>
    </div>
</template>
<script setup lang="ts">
const modelValue = defineModel<boolean>({
    required: true
})
defineProps<{disabled?: boolean}>()
</script>
<style lang="scss" module>
.switch {
    position: relative;
    display: inline-block;
}

.label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}

.checkbox {
    height: 0;
    width: 0;
    visibility: hidden;
    position: absolute;


    &:checked + .button {
        background: var(--accent-color);
        &:after {
            left: calc(100% - 5px);
            transform: translateX(-100%);
        }
    }

    &:disabled {
        & + .button {
            background: var(--button-disabled-bg);
            cursor: not-allowed;
            &:after {
                background: var(--button-disabled-color);
            }
        }
    }
}

.button {
    cursor: pointer;
    width: 60px;
    height: 30px;
    background: var(--background-color);
    display: block;
    border-radius: 30px;
    position: relative;
    transition: 0.3s all ease;

    &:after {
        content: '';
        position: absolute;
        top: 5px;
        left: 5px;
        width: 20px;
        height: 20px;
        background: #fff;
        border-radius: 20px;
        transition: 0.3s all ease;
    }

    &:active:after:not(:disabled) {
        width: 25px;
    }
}

</style>