<template>
  <div class="h3-tab" ref="tab" :class="{'h3-tab-no-animate': !animate, 'h3-tab-item-border-none': !borderBottom}">
    <slot></slot>
    <div v-if="animate" class="h3-tab-ink-bar" :class="barClass" :style="barStyle">
      <span class="h3-tab-bar-inner" :style="innerBarStyle" v-if="customBarWidth"></span>
    </div>
    <!-- <div class="h3-tabs-content-wrap h3-tabs-content-wrap-animated">

    </div> -->
  </div>
</template>

<script>
import { parentMixin } from '../../mixins/multi-items';

export default {
  name: 'h3-tab',
  mixins: [parentMixin],
  mounted() {
    // stop bar anmination on first loading
    this.$nextTick(() => {
      setTimeout(() => {
        this.hasReady = true;
      }, 0);
    });
  },
  props: {
    lineWidth: {
      type: Number,
      default: 2,
    },
    activeColor: String,
    barActiveColor: String,
    defaultColor: String,
    disabledColor: String,
    animate: {
      type: Boolean,
      default: true,
    },
    customBarWidth: [Function, String],
    preventDefault: Boolean,
    borderBottom: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    barLeft() {
      return `${this.currentIndex * (100 / this.number)}%`;
    },
    barRight() {
      return `${(this.number - this.currentIndex - 1) * (100 / this.number)}%`;
    },
    // when prop:custom-bar-width
    innerBarStyle() {
      return {
        width: typeof this.customBarWidth === 'function' ? this.customBarWidth(this.currentIndex) : this.customBarWidth,
        backgroundColor: this.barActiveColor || this.activeColor,
      };
    },
    // end
    barStyle() {
      const commonStyle = {
        left: this.barLeft,
        right: this.barRight,
        display: 'block',
        height: `${this.lineWidth}px`,
        transition: !this.hasReady ? 'none' : null,
      };
      if (!this.customBarWidth) {
        commonStyle.backgroundColor = this.barActiveColor || this.activeColor;
      } else {
        commonStyle.backgroundColor = 'transparent'; // when=prop:custom-bar-width
      }
      return commonStyle;
    },
    barClass() {
      return {
        'h3-tab-ink-bar-transition-forward': this.direction === 'forward',
        'h3-tab-ink-bar-transition-backward': this.direction === 'backward',
      };
    },
  },
  watch: {
    currentIndex(newIndex, oldIndex) {
      this.direction = newIndex > oldIndex ? 'forward' : 'backward';
      this.$emit('on-index-change', newIndex, oldIndex);
    },
  },
  data() {
    return {
      direction: 'forward',
      right: '100%',
      hasReady: false,
    };
  },
};
</script>


<style lang="less">
@import './style/index.less';
</style>