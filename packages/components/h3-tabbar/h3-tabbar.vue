<template>
  <div class="h3-tabbar" >
    <slot></slot>
  </div>
</template>

<script>
import { parentMixin } from '../../mixins/multi-items';

export default {
  name: 'h3-tabbar',
  mixins: [parentMixin],
  props: {
    barTintColor: {
      type: String,
      default: '#fff',
    },
    tintColor: {
      type: String,
      default: '#108ee9',
    },
    unselectedTintColor: {
      type: String,
      default: '#888',
    },
    animated: {
      type: Boolean,
      default: false,
    },
    swipeable: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      this.$nextTick(() => {
        const $el = this.$el;
        const position = window.getComputedStyle($el).position;
        if (position === 'absolute') {
          if (document.documentElement.offsetHeight !== window.innerHeight) {
            console.warn('tabbar 定位默认为 absolute，如果你没有使用 100% 布局，需要手动设置 style position 为 fixed');
          }
        }
      });
    }
  },
};
</script>

<style lang="less">
@import '../../styles/themes/default.less';
@import '../../styles/mixins.less';
@import '../../styles/h3-ui/h3-tabbar.less';
@import '../../styles/h3-ui/reddot.less';
// .h3-tab {
//     position: relative;
//     height: 100%;
// }

.h3-tab__panel {
    box-sizing: border-box;
    height: 100%;
    padding-bottom: 50px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
.h3-tab__content{
    display: none;
}

.h3-tabbar__icon {
  position: relative;
}
.h3-tabbar__icon > sup {
  position: absolute;
  // top: -8px;
  top: 0;
  left: 100%;
  transform: translateX(-40%);
  z-index: 101;
}
.h3-tabbar__item.vux-tabbar-simple {
  padding: 0;
  height: 50px;
  line-height: 50px;
}
.h3-tabbar-simple .h3-tabbar__label {
  font-size: 14px;
  line-height: 50px;
}
</style>

