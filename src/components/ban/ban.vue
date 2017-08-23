<template lang="html">
  <div class="e-ban">
    <p class="page-container">你的权限不够，无法访问此页面。<router-link class="back" to="/home">返回首页</router-link></p>

  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">

.page-container {
    font-size: 20px;
    text-align: center;
    color: rgb(192, 204, 218);
}
.back {
  text-decoration: none;
  color: #333;
}
</style>
