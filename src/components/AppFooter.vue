<template>
    <footer :class="$style.footer">
        <div :class="$style.content">
            <div>
                <h4 :class="$style.title">Music Multitool</h4>
                <p :class="$style.description">
                    
                    🎶 A web-based music sandbox for creators, musicians, and enthusiasts.
                </p>
            </div>
            <div>
                <h4 :class="$style.title">Community</h4>
                <p :class="$style.description">
                    🔗 Join our community on Telegram:
                    <DefaultLink to="https://t.me/music_multitool_web" target="_blank">Telegram Channel</DefaultLink>
                </p>
            </div>

        </div>
    </footer>
</template>

<script setup lang="ts">
import DefaultLink from './DefaultLink.vue';

</script>

<style lang="scss" module>
.footer {
    width: calc(100% - 48px);
    padding: 24px;
    background: var(--primary-dark-color);
    margin-top: auto;
}
.title {
    margin-top: 0;
    margin-bottom: 12px;
}
.content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 48px;
    flex-wrap: wrap;
}

.description {
    color: var(--font-color);
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
    max-width: 600px;
}

.donate {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--font-color);
    font-size: 14px;
}
</style> 