<template>
  <div>
    <div :class="wrapCls" >
      <div v-for="i in num" :key="i" class="h3-M2 h3-slide-nav-item" :class="[(i-1) === active? 'active':'']"
      />
    </div>
  </div>
</template>

<script>
const prefixClass = 'h3';

export default {
  name: 'h3-slide-nav',
  props: {
    num: {
      type: Number,
      default: 0,
    },
    active: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
      default: 'CENTER',
      validator: val => ['CENTER', 'RIGHT'].indexOf(val) > -1,
    },
  },
  created() {
  },
  computed: {
    wrapCls() {
      if (this.position === 'RIGHT') {
        return `${prefixClass}-slide-nav FBH FBAC FBJE`;
      }
      return `${prefixClass}-slide-nav FBH FBAC FBJC`;
    },
  },
  watch: {
    active(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="less">

.h3-M2 {
  margin: 2px;
}
.FBJC {
    -webkit-box-pack: center;
    justify-content: center;
}
.FBAC {
    -webkit-box-align: center;
    align-items: center;
}

.FBH, .FBV {
    display: flex;
}
.h3-slide-nav {
  position:absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  padding: 0 16px;
  z-index: 1;
  .h3-slide-nav-name-item {
    color: #fff;
    font-size: 14px;
    line-height: 30px;
  }
  .h3-slide-nav-item {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: rgba(255,255,255,.3);
    opacity: 1;
    transition: width linear .4s;
    margin: 0 4px;
    &.active {
      background-color: #fff;
      width: 10px;
    }
      
  }
}

.h3-slide-nav-name-wrap {
  justify-content: space-between;
  padding: 0 15px;
}
</style>


