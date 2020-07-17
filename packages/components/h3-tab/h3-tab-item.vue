<template>
  <div
    class="h3-tab-item"
    :class="[currentSelected ? activeClass : '', {'h3-tab-selected': currentSelected, 'h3-tab-disabled': disabled}]"
    :style="style"
    @click="onItemClick">
    <slot></slot>
    <span
      :style="{background: badgeBackground, color: badgeColor}"
      class="h3-tab-item-badge"
      v-if="typeof badgeLabel !== 'undefined' && badgeLabel !== ''">
    {{ badgeLabel }}</span>
  </div>
</template>

<script>
import { childMixin } from '../../mixins/multi-items';

export default {
  name: 'h3-tab-item',
  mixins: [childMixin],
  props: {
    activeClass: String,
    disabled: Boolean,
    badgeBackground: {
      type: String,
      default: '#f74c31',
    },
    badgeColor: {
      type: String,
      default: '#fff',
    },
    badgeLabel: String,
  },
  data() {
    return {
      containerWidth: 0,
    };
  },
  methods: {
    isTabScrollable() {
      const tabs = this.$el.parentElement;
      this.containerWidth = tabs.parentElement.offsetWidth;
      if (tabs.offsetWidth > tabs.parentElement.offsetWidth) {
        return true;
      }
      return false;
    },
  },
  computed: {
    style() {
      let color = null;
      if (this.currentSelected) {
        color = this.$parent.activeColor;
      } else if (this.disabled) {
        color = this.$parent.disabledColor;
      } else {
        color = this.$parent.defaultColor;
      }
      return {
        borderWidth: `${this.$parent.lineWidth}px`,
        borderColor: this.$parent.activeColor,
        color,
        border: this.$parent.animate ? 'none' : 'auto',
      };
    },
  },
  watch: {
    currentSelected(val) {
      // 如果是选中状态，且父元素大于可以滚动，则判断当前选中元素的可视范围
      if (val && this.isTabScrollable()) {
        // 判断当前元素是否超出tabs的范围
        const offsetLeft = this.$el.offsetLeft;
        const scrollWrapper = this.$el.parentElement.parentElement;
        const scrollLeft = scrollWrapper.scrollLeft;
        if ((offsetLeft + this.$el.offsetWidth) > this.containerWidth + scrollWrapper.scrollLeft) {
          // 移到屏幕中间

          scrollWrapper.scrollLeft += (offsetLeft - scrollLeft - (this.containerWidth / 2));
        } else if (scrollLeft > 0 && offsetLeft < (this.containerWidth + scrollLeft)) {
          // scrollWrapper.scrollLeft = (offsetLeft - scrollLeft - (this.containerWidth / 2));
          const left = offsetLeft - (this.containerWidth / 2);
          scrollWrapper.scrollLeft = left <= 0 ? 0 : left;
        }
      }
    },
  },
};
</script>