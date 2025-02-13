<template>
    <div class="layout">
        <Header />
        <main class="content">
            <slot />
        </main>
        <Footer />
    </div>
</template>

<script setup>
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';
</script>

<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content {
    flex: 1;
    padding: 20px;
}
</style>
