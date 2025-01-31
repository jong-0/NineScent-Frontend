<script setup>
import { RouterView } from 'vue-router';
import Layout from './layouts/Layout.vue';
import ItemDetail from './components/Item/ItemDetail.vue';
</script>

<template>
    <Layout>
        <RouterView />
        <ItemDetail/>
    </Layout>
</template>

<style scoped></style>
