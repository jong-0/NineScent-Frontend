<template>
    <footer class="footer">
        <div class="footer-container">
            <!-- 로고 -->
            <div class="footer-left">
                <p class="logo">NINESCENT</p>
                <p class="copyright">Copyright © NINESCENT.</p>
                <p class="copyright">All rights reserved.</p>
            </div>

            <!-- 나머지 섹션 -->
            <div class="footer-right">
                <!-- 고객 서비스 -->
                <div class="footer-section">
                    <h4>고객서비스</h4>
                    <ul>
                        <li><a href="#">이벤트</a></li>
                        <li><a href="#">고객센터</a></li>
                        <li><a href="#">1:1 문의</a></li>
                    </ul>
                </div>

                <!-- 법적 고지 -->
                <div class="footer-section">
                    <h4>법적 고지</h4>
                    <ul>
                        <li><a href="#">회사소개</a></li>
                        <li><a href="#">이용약관</a></li>
                        <li><a href="#">개인정보처리방침</a></li>
                        <li><a href="#">이용안내</a></li>
                    </ul>
                </div>

                <!-- 소셜 미디어 -->
                <div class="footer-section">
                    <h4>소셜 미디어</h4>
                    <ul>
                        <li><a href="#">인스타그램</a></li>
                        <li><a href="#">카카오톡</a></li>
                        <li><a href="#">페이스북</a></li>
                        <li><a href="#">유튜브</a></li>
                    </ul>
                </div>

                <!-- CS Center -->
                <div class="footer-section">
                    <h4>CS CENTER</h4>
                    <p>000-0000</p>
                    <p>AM 10:00 - PM 17:00</p>
                    <p>토, 일, 공휴일 휴무</p>
                </div>
            </div>
        </div>
    </footer>
</template>
<style scoped>
/* 공통 스타일 */
.footer {
    padding: 20px;
    background-color: #f8f8f8;
    color: #555;
    font-size: 12px;
    line-height: 1.6;
}

/* 컨테이너 기본 설정 */
.footer-container {
    display: flex;
    justify-content: space-between; /* 왼쪽과 오른쪽 분리 */
    align-items: center; /* 세로 중앙 정렬 */
    max-width: 1300px;
    margin: 0 auto;
}

/* 왼쪽 로고 */
.footer-left {
    flex: 1;
    text-align: left;
    left: 0; /* 왼쪽에 고정 */

    /* transform: translateY(-50%); */
}

.logo {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

/* 오른쪽 섹션 */
.footer-right {
    flex: 3;
    display: flex;
    justify-content: flex-end; /* 오른쪽으로 정렬 */
    gap: 20px; /* 섹션 간 간격 */
    flex-wrap: wrap;
    padding-left: 100px;
}

.footer-section {
    flex: 1 1 200px; /* 섹션 크기 */
}

.footer-section h4 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}

.footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-section ul li {
    margin-bottom: 5px;
}

.footer-section ul li a {
    text-decoration: none;
    color: #555;
    transition: color 0.3s;
}

.footer-section ul li a:hover {
    color: #000;
}

/* 화면 폭이 좁아질 때 스타일 변경 */
@media (max-width: 1290px) {
    .footer-right .footer-section:nth-child(4) {
        display: none; /* 네 번째 섹션 숨김 (CS CENTER) */
    }
}

@media (max-width: 992px) {
    .footer-right .footer-section:nth-child(3) {
        display: none; /* 세 번째 섹션 숨김 (소셜 미디어) */
    }
}

@media (max-width: 768px) {
    .footer-right .footer-section:nth-child(2) {
        display: none; /* 두 번째 섹션 숨김 (법적 고지) */
    }
}

@media (max-width: 576px) {
    .footer-right {
        display: none; /* 오른쪽 섹션 전체 숨김 */
    }

    .footer-container {
        justify-content: center; /* 로고를 중앙 정렬 */
    }
}
</style>
