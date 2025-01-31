<template>
    <div class="home">
        <section class="hero">
            <h1>Discover the Perfect Fragrance</h1>
            <p>Your journey to elegance starts here.</p>
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
    text-align: center;
    padding: 50px 20px;
    background-color: #ececec;
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
    background-color: #333;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 16px;
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
