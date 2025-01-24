<template>
  <header class="header">
    <div class="logo">NINESCENT</div>
    <nav class="navigation">
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Shop</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f8f8;
}
.logo {
  font-size: 24px;
  font-weight: bold;
}
.navigation ul {
  list-style: none;
  display: flex;
  gap: 15px;
}
.navigation a {
  text-decoration: none;
  color: #333;
}
</style>
