<template>
    <footer :class="$style.footer">
        <div :class="$style.content">
            <p :class="$style.description">
                A web-based music creation tool featuring a virtual keyboard, rhythm tools, and recording capabilities.
            </p>
        </div>
    </footer>
</template>

<style lang="scss" module>
.footer {
    width: calc(100% - 48px);
    padding: 24px;
    background: var(--primary-dark-color);
    margin-top: auto;
}

.content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
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

.link {
    color: var(--accent-color);
    text-decoration: none;
    transition: all 0.2s ease;
    padding: 6px 12px;
    border-radius: var(--button-border-radius);
    background: var(--button-primary-bg);
    color: var(--button-text-color);

    &:hover {
        background: var(--button-primary-hover);
        transform: translateY(-1px);
    }

    &:active {
        background: var(--button-primary-active);
        transform: translateY(0);
    }
}
</style> 