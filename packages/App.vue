<template>
  <div id="app">
    <!-- <h3-navbar :onLeftClick="goBack">
      Demo 示例
    </h3-navbar> -->
    <transition :name="viewTransition">
      <keep-alive>
        <router-view class="router"/>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import H3Navbar from './components/h3-navbar/';

export default {
  name: 'App',
  components: {
    H3Navbar,
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
  computed: {
    viewTransition() {
      if (this.$store.state.direction === 'forward') {
        return 'h3-slide-in';
      }
      return 'h3-slide-out';
    },
  },
};
</script>

<style lang="less">
@import 'styles/reset.less';
@import 'styles/icon/iconfont.css';
@import  'components/h3-datetime/style/index.less';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  background-color: #f5f5f9;
  font-size: 14px;
  margin:0;
}

a,
a:hover,
a:active {
  text-decoration: none;
}
.demoTitle {
  padding: 15px 0 9px 15px;
  color: #000;
  font-size: 16px;
  line-height: 16px;
  height: 16px;
  font-weight: bolder;
  position: relative;
  box-sizing: content-box
}

.router {
  position: absolute;
  width: 100%;
  transition: all .5s ease;
  top: 0;
  bottom: 0;
  box-shadow: 1px 1px 5px #ddd;
}

.h3-slide-out-enter-active,
.h3-slide-out-leave-active,
.h3-slide-in-enter-active,
.h3-slide-in-leave-active {
  will-change: transform;
  transition: all 300ms;
  height: 100%;
  // top: 46px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.h3-slide-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.h3-slide-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.h3-slide-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.h3-slide-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
