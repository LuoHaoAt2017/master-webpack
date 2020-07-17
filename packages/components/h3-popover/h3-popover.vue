<template>
  <div >
    <span ref="trigger" @click="toggle">
      <slot>
      </slot>
    </span>
    <transition name="h3-popover-mask">
      <div class="h3-popover-mask h3-popover-mask_transparent" ref="mask" @click="onClickingMask" v-show="this.mask && this.isVisible"></div>
    </transition>
    <div class="h3-popover" :style="popoverStyle" :class="wrapClass" ref="popover" v-show="isVisible">
      <div class="h3-popover-content">
        <div class="h3-popover-arrow"></div>
        <div class="h3-popover-inner">
          <div class="h3-popover-inner-wrapper" >
            <h3-popover-item v-for="(menu, index) in menus" :key="index"
              :disabled="menu.disabled" 
              :h3Style="menu.style"
              :activeStyle="menu.activeStyle"
              :activeClassName="menu.activeClassName"
              :firstItem="index==0"
              :icon="menu.icon"
              :content="menu.content"
              :index="index"
              :onSelect="select"
            >
            </h3-popover-item>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import H3PopoverItem from '../h3-popover/h3-popover-item';

export default {
  name: 'h3-popover',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onSelect: Function,
    onVisibleChange: Function,
    placement: {
      type: String,
      default: 'bottomRight',
    },
    mask: {
      type: Boolean,
      default: false,
    },
    prefixCls: {
      type: String,
      default: 'h3-popover',
    },
    // {style: obj, activeStyle: obj,activeClassName: string,
    // icon: string, content: string}
    menus: {
      type: Array,
      required: true,
    },
    gutter: {
      type: Number,
      default: 5,
    },
  },
  components: {
    H3PopoverItem,
  },
  data() {
    return {
      isVisible: this.visible,
      popoverStyle: {},
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.mask.addEventListener('touchmove', this.onTouchMove, false);
      if (this.isVisible) {
        const position = this.getDockPosition();
        this.popoverStyle = {
          left: `${position.left}px`,
          top: `${position.top}px`,
        };
      }
    });
  },
  methods: {
    toggle() {
      this.isVisible = !this.isVisible;
      if (this.isVisible) {
        const position = this.getDockPosition();
        this.popoverStyle = {
          left: `${position.left}px`,
          top: `${position.top}px`,
        };
      }
    },
    getDockPosition() {
      const trigger = this.$refs.trigger.children[0];
      const popover = this.$refs.popover;
      popover.style.display = 'block';
      const position = {};
      switch (this.placement) {
        case 'top' :
          position.left = trigger.offsetLeft - popover.offsetWidth / 2 +
           trigger.offsetWidth / 2;
          position.top = trigger.getBoundingClientRect().top - popover.offsetHeight -
           this.gutter;
          break;
        case 'left':
          position.left = trigger.offsetLeft - popover.offsetWidth - this.gutter;
          position.top = trigger.getBoundingClientRect().top +
           trigger.offsetHeight / 2 - popover.offsetHeight / 2;
          break;
        case 'right':
          position.left = trigger.offsetLeft + trigger.offsetWidth + this.gutter;
          position.top = trigger.getBoundingClientRect().top +
          trigger.offsetHeight / 2 - popover.offsetHeight / 2;
          break;
        case 'bottom':
          position.left = trigger.offsetLeft - popover.offsetWidth / 2 +
           trigger.offsetWidth / 2;
          position.top = trigger.getBoundingClientRect().top + trigger.offsetHeight +
           this.gutter;
          break;
        case 'topLeft':
          position.left = trigger.offsetLeft;
          position.top = trigger.getBoundingClientRect().top - popover.offsetHeight -
           this.gutter;
          break;
        case 'topRight':
          position.left = trigger.offsetLeft + trigger.offsetWidth - popover.offsetWidth;
          position.top = trigger.getBoundingClientRect().top - popover.offsetHeight -
           this.gutter;
          break;
        case 'bottomLeft':
          position.left = trigger.offsetLeft;
          position.top = trigger.getBoundingClientRect().top + trigger.offsetHeight +
           this.gutter;
          break;
        case 'bottomRight':
          position.left = trigger.offsetLeft + trigger.offsetWidth - popover.offsetWidth;
          position.top = trigger.getBoundingClientRect().top + trigger.offsetHeight +
           this.gutter;
          break;
        default:
          break;
      }
      return position;
    },
    onTouchMove(e) {
      e.preventDefault();
    },
    onClickingMask() {
      this.isVisible = false;
    },
    select(index) {
      this.isVisible = false;
      if (this.onSelect) {
        this.onSelect.call(null, index);
      }
    },

  },
  computed: {
    wrapClass() {
      return `h3-popover-placement-${this.placement}`;
    },
    // popoverStyle() {
    //   if (this.isVisible) {
    //     const position = this.getDockPosition();
    //     return {
    //       left: `${position.left}px`,
    //       top: `${position.top}px`,
    //     };
    //   }
    //   return {};
    // },
  },
  watch: {
    isVisible(val) {
      if (this.onVisibleChange) {
        this.onVisibleChange(val);
      }
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';

@popoverPrefixCls: h3-popover;


@import './style/base';
@h-spacing-md: 8px;
.@{popoverPrefixCls}-inner {
  font-size: @font-size-subhead;
  color: @color-text-base;
  background-color: @fill-base;
  border-radius: @radius-sm;
  box-shadow: 0 0 2 * @hd rgba(0, 0, 0, 0.21);
  overflow: hidden; // for popover item active background color not overflow

  &-wrapper {
    position: relative;
    background-color: @fill-base;
  }
}

.@{popoverPrefixCls} .@{popoverPrefixCls}-item {
  padding: 0 @h-spacing-md;
  .hairline('bottom');

  &-container {
    position: relative;
    display: flex;
    align-items: center;
    height: 39 * @hd;
    box-sizing: border-box;
    padding: 0 @h-spacing-md;
    .@{popoverPrefixCls}-item-content {
      white-space: nowrap;
    }
  }
  &:not(:first-child) {
    .@{popoverPrefixCls}-item-container {
      .hairline('top');
    }
  }

  // &.@{popoverPrefixCls}-item-active {
  //   .@{popoverPrefixCls}-item-container {
  //     .hairline-remove('top');
  //   }
  // }

  // &.@{popoverPrefixCls}-item-active + .@{popoverPrefixCls}-item .@{popoverPrefixCls}-item-container {
  //   .hairline-remove('top');
  // }
  


  &.@{popoverPrefixCls}-item-active {
    background-color: @border-color-base;
  }

  &.@{popoverPrefixCls}-item-active.@{popoverPrefixCls}-item-fix-active-arrow {
    position: relative;
  }

  &.@{popoverPrefixCls}-item-disabled {
    color: @color-text-disabled;

    &.@{popoverPrefixCls}-item-active {
      background-color: transparent;
    }
  }

  &-icon {
    margin-right: @h-spacing-md;
    // width: @icon-size-xs;
    // height: @icon-size-xs;
    // i {
    //   width: @icon-size-xs;
    //   height: @icon-size-xs;
    // }
  }
}
</style>

