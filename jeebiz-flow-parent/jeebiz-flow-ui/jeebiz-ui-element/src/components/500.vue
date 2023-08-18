<template>
  <div class="wrap">
    <div class="main">
      <div class="top">500</div>
      <div class="center">服务器内部可能发生错误，请稍后重试</div>
      <div class="bottomBtn" @click="goIndex">返回首页</div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      goIndex () {
        this.$router.push('/');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    height: 100%;
    background: url('/static/images/404.png') no-repeat center;
    background-size: cover;
    overflow: hidden;
    position: relative;
  }
  .main {
    position: absolute;
    left: 220px;
    top: 220px;
  }
  .top {
    width:508px;
    height:162px;
    font-size:161px;
    font-family: '微软雅黑';
    font-weight:400;
    line-height:162px;
    color:rgba(255,255,255,1);
    text-shadow:10px 10px 0px rgba(255,255,255,0.16);
    letter-spacing:60px;
    opacity:1;
  }
  .center {
    font-size:20px;
    padding: 40px 0;
    color: white;
  }
  .bottomBtn {
    width:130px;
    height:40px;
    background:rgba(255,255,255,1);
    opacity:1;
    border-radius:20px;
    text-align: center;
    line-height: 40px;
    color: #2EBBE8;
    &:hover {
      cursor: pointer;
    }
  }
</style>
