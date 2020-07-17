<template>
  <h3-touch 
  :onTouchStart="touchStart" 
  :onTouchMove="touchMove" 
  :onTouchEnd="touchEnd" 
  :onTouchCancel="touchCancel"
  >
  <div @click="click"
  :class="wrapClasses" 
  :style="wrapStyle">
    <div class="h3-popover-item-container">
      <span class="h3-popover-item-icon" v-if="icon">
        <h3-icon :type="icon"></h3-icon>
      </span>
      <span class="h3-popover-item-content">
        {{content}}
      </span>
    </div>
  </div>
  </h3-touch>
</template>

<script>
import cx from 'classnames';
import H3Touch from '../h3-touch/';
import touch2 from '../../mixins/touch2';
import H3Icon from '../h3-icon/';

const prefixCls = 'h3-popover';
export default {
  name: 'h3-popover-item',
  mixins: [touch2],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    h3Style: Object,
    firstItem: Boolean,
    activeStyle: Object,
    activeClassName: String,
    index: Number,
    onSelect: Function,
    icon: String,
    content: {
      type: String,
    },
  },
  components: {
    H3Touch,
    touch2,
    H3Icon,
  },
  data() {
    return {
      isActive: false,
    };
  },
  methods: {
    click() {
      if (this.onSelect) {
        this.onSelect(this.index);
      }
    },
  },
  computed: {
    wrapClasses() {
      const cls = cx(`${prefixCls}-item`, {
        [`${prefixCls}-item-disabled`]: this.disabled,
        [`${prefixCls}-item-active `]: this.isActive,
        [`${prefixCls}-item-fix-active-arrow`]: this.firstItem && this.isActive,
        [`${this.activeClassName}`]: this.isActive && this.activeClassName,
      });
      return cls;
    },
    wrapStyle() {
      // 约定style 和 activeStyle都是以对象的形式传入
      if (!this.isActive) {
        return this.h3Style;
      }
      return { ...this.h3Style, ...this.activeStyle };
    },
  },
};
</script>

