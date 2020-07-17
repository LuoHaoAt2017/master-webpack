<template>
  <div class="h3-tab-flow" ref="flowTab" :class="{'h3-tab-no-animate': !animate, 'h3-tab-item-border-none': !borderBottom}">
    <slot></slot>
    <div v-if="animate" ref="inkBar" class="h3-tab-ink-bar" :class="barClass">
      
    </div>
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
    auto: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    // barLeft() {
    //   return `${this.currentIndex * (100 / this.number)}%`;
    // },
    // barRight() {
    //   return `${(this.number - this.currentIndex - 1) * (100 / this.number)}%`;
    // },
    // // when prop:custom-bar-width
    // innerBarStyle() {
    //   let width = 0;
    //   if (this.auto) {
    //     const tab = this.$refs.tab;
    //     const curTabItem = tab.children[this.currentIndex];
    //     if (curTabItem) {
    //       width = `${curTabItem.offsetWidth}px`;
    //     }
    //   }
    //   return {
    //     width,
    //     backgroundColor: this.barActiveColor || this.activeColor,
    //   };
    // },
    // // end
    // barStyle() {
    //   const commonStyle = {
    //     left: this.barLeft,
    //     right: this.barRight,
    //     display: 'block',
    //     height: `${this.lineWidth}px`,
    //     transition: !this.hasReady ? 'none' : null,
    //   };
    //   if (!this.customBarWidth) {
    //     commonStyle.backgroundColor = this.barActiveColor || this.activeColor;
    //   } else {
    //     commonStyle.backgroundColor = 'transparent'; // when=prop:custom-bar-width
    //   }
    //   return commonStyle;
    // },
    barClass() {
      return {
        'h3-tab-ink-bar-transition-forward': this.direction === 'forward',
        'h3-tab-ink-bar-transition-backward': this.direction === 'backward',
      };
    },
  },
  methods: {
    setInkBarStyle(index) {
      const items = this.$refs.flowTab.children;
      if (items.length > 1) {
        const left = items[index].offsetLeft;
        const right = items[index].offsetWidth;
        this.$refs.inkBar.style.left = `${left}px`;
        this.$refs.inkBar.style.width = `${right}px`;
        this.$refs.inkBar.style.display = 'block';
        this.$refs.inkBar.style.height = `${this.lineWidth}px`;
        this.$refs.inkBar.style.transition = this.hasReady ? 'none' : null;
        this.$refs.inkBar.style.backgroundColor = this.barActiveColor || this.activeColor;
      }
    },
  },
  watch: {
    currentIndex(newIndex, oldIndex) {
      this.setInkBarStyle(newIndex);
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
.h3-tab-item{
  color: #999;
}
</style>