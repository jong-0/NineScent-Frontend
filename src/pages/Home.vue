<template>
    <div class="home">
        <!-- Hero 섹션 -->
        <section class="hero relative">
            <!-- <img :src="mainBanner" class="hero-bg" alt="Main Banner" /> -->
            <div class="hero-content">
                <p class="hero-text">그와 그녀의 향기를 찾아보세요.</p>
                <button class="hero-btn">자세히 보기 →</button>
            </div>
        </section>

        <!-- 소개 섹션 -->
        <section class="intro-section">
            <div class="intro-item" v-for="(section, index) in introSections" :key="index">
                <img :src="section.image" :alt="section.title" class="intro-image" />
                <div class="intro-text">
                    <h2>{{ section.title }}</h2>
                    <button class="intro-btn">{{ section.buttonText }} →</button>
                </div>
            </div>
        </section>

        <!-- Fragrance Line 섹션 -->
        <section class="fragrance-line">
            <h2>Fragrance Line</h2>
            <p class="sub-text">당신을 위한 특별한 향수 라인</p>

            <div class="carousel">
                <div class="carousel-track">
                    <div class="carousel-item" v-for="(perfume, index) in fragranceLine" :key="index">
                        <img :src="perfume.image" :alt="perfume.name" />
                        <h3>{{ perfume.name }}</h3>
                        <p class="price">{{ perfume.price }}</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
// import mainBanner from '@/assets/images/main-banner.jpg';

// 소개 섹션 데이터
const introSections = [
    {
        title: '시소올로지 핸드 밤',
        image: '/Users/jmj/NineScent-Frontend/src/assets/images/mainImg.jpeg',
        buttonText: '자세히 보기',
    },
    {
        title: '신규 향기 시향회',
        image: 'https://items-img-bucket.s3.ap-northeast-2.amazonaws.com/main/perfume-sample.jpg',
        buttonText: '자세히 보기',
    },
];

// Fragrance Line (향수 캐러셀)
const fragranceLine = [
    {
        name: '른 델라 퍼퓸',
        price: '₩98,000',
        image: 'https://ninescent-img.s3.ap-northeast-2.amazonaws.com/products/perfume/Racio_a_ola/main.jpg',
    },
    {
        name: '루미에르 오드퍼퓸',
        price: '₩110,000',
        image: 'https://ninescent-img.s3.ap-northeast-2.amazonaws.com/products/perfume/Racio_a_ola/main.jpg',
    },
    {
        name: '미스틱 오드퍼퓸',
        price: '₩99,000',
        image: 'https://ninescent-img.s3.ap-northeast-2.amazonaws.com/products/perfume/Racio_a_ola/main.jpg',
    },
];
</script>

<style scoped>
/* Hero 스타일 */
.hero {
    position: relative;
    height: 750px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.hero-bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
}

.hero-content {
    position: relative;
    text-align: center;
    color: #fff;
}

.hero-text {
    font-size: 24px;
    margin-bottom: 20px;
}

.hero-btn {
    padding: 10px 20px;
    background-color: #fff;
    color: #333;
    border: none;
    cursor: pointer;
    font-size: 14px;
}

/* 소개 섹션 스타일 */
.intro-section {
    display: flex;
    justify-content: space-between;
    padding: 50px;
}

.intro-item {
    text-align: center;
    width: 30%;
}

.intro-image {
    width: 100%;
    border-radius: 8px;
}

.intro-text {
    margin-top: 10px;
    font-size: 18px;
}

.intro-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
}

/* Fragrance Line 스타일 */
.fragrance-line {
    text-align: center;
    padding: 50px 0;
}

.sub-text {
    color: #777;
    font-size: 16px;
    margin-bottom: 30px;
}

.carousel {
    display: flex;
    overflow-x: auto;
    padding: 20px 0;
}

.carousel-track {
    display: flex;
    gap: 20px;
}

.carousel-item {
    text-align: center;
    width: 200px;
}

.carousel-item img {
    width: 100%;
    height: auto;
}

/* 푸터 스타일 */
.footer {
    background-color: #f5f5f5;
    padding: 40px 0;
}

.footer-container {
    display: flex;
    justify-content: space-around;
    text-align: left;
}

.footer-column h4 {
    font-size: 18px;
    margin-bottom: 10px;
}

.footer-column ul {
    list-style: none;
    padding: 0;
}

.footer-column li {
    font-size: 14px;
    color: #666;
}
</style>
