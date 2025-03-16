<template>
    <div >
        <HeaderComponent :class="$style.header">
            <div :class="$style.container">
                <h2>Music Multitool</h2>
            </div>
        </HeaderComponent>
        <main :class="$style.container">
            <slot></slot>
        </main>
        <AppFooter />
    </div>
</template>
<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>
<style lang="scss" module>
.container {
    padding: 8px 8px;
    max-width: 1248px;
    margin: auto;
    margin-bottom: 20px;
}
.header {
    margin-bottom: 32px;
}
</style>