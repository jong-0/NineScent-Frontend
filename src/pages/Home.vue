<template>
    <div class="home">
        <section class="hero" :style="{ backgroundImage: `url(${mainImg1})` }">
            <!-- <h2>Perfect Fragrance</h2> -->
            <p>Your journey to elegance starts here with us.</p>
            <button class="shop-now">Shop Now</button>
        </section>
        <section class="featured-products">
            <h2>Featured Products</h2>
            <div class="product-list">
                <div v-for="product in featuredProducts" :key="product.id" class="product-item">
                    <img :src="product.image" :alt="product.name" />
                    <h3>{{ product.name }}</h3>
                    <p>{{ product.price }}</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import mainImg1 from '@/assets/images/mainImg.jpeg';

const featuredProducts = [
    {
        id: 1,
        name: 'Rose Elegance',
        price: '$89',
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 2,
        name: 'Citrus Bloom',
        price: '$79',
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 3,
        name: 'Mystic Oud',
        price: '$99',
        image: 'https://via.placeholder.com/150',
    },
];
</script>

<style scoped>
.home {
    font-family: Arial, sans-serif;
    color: #333;
}
.hero {
    min-height: 750px;
    text-align: center;
    padding: 30px 20px;
    background-color: #ececec;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
.hero h1 {
    font-size: 36px;
}
.hero p {
    font-size: 18px;
    margin: 10px 0;
}
.shop-now {
    padding: 10px 20px;
    background-color: #f7f6f0;
    color: #333;
    border: none;
    cursor: pointer;
    font-size: 14px;
    margin-top: 10px;
}
.featured-products {
    padding: 20px;
}
.product-list {
    display: flex;
    gap: 20px;
    justify-content: center;
}
.product-item {
    text-align: center;
}
.product-item img {
    width: 150px;
    height: 150px;
    object-fit: cover;
}
</style>
