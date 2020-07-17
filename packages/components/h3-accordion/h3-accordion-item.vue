<template>
  <div class="list list-borderless list-accordion staticTitle" :style="wrpsStyle">
    <item class="item-icon-right " v-if="position === 'right'" @click.native="onClick()">
      <div class="list-accordion-title-wrapper" :class="itemTitleWrapperCls">
        <span v-text="title" v-if="title"></span>
        <slot name="title"></slot>
      </div>
      <i class="icon aufont " :class="wrapIconClass"></i>
    </item>
    <item class="item-icon-left " :class="itemTitleCls" v-else @click.native="onClick()">
      <i class="icon aufont " :class="wrapIconClass"></i>
      <div class="list-accordion-title-wrapper" :class="itemTitleWrapperCls">
        <span v-text="title" v-if="title"></span>
        <slot name="title"></slot>
      </div>
    </item>
    <transition name="h3-accordion">
      <div v-show="expanded" class="accordion-content" :class="accordionContentCls">
        <slot></slot>
        <HairlineBottom></HairlineBottom>
      </div>
    </transition>
  </div>
</template>
<script>
import cx from 'classnames';
import channel from './channel';
import HairlineItem from '../h3-list/h3-hairline-item';
import HairlineBottom from '../h3-list/h3-hairline-bottom';

export default {
  name: 'h3-accordion-item',
  components: {
    Item: HairlineItem,
    HairlineBottom,
  },
  props: {
    title: String,
    iconClass: {
      type: String,
      default: 'icon-base-right',
    },
    itemTitleWrapperCls: {
      type: String,
    },
    position: {
      type: String,
      default: 'right',
      validator: val => ['right', 'left'].indexOf(val) > -1,
    },
    itemTitleCls: {
      type: String,
    },
    // TODO: validator
    multi: {
      type: Boolean,
      default: false,
    },
    accordionContentCls: String,
  },
  data() {
    return {
      expanded: false,
      index: -1,
      // multi: this.$parent.multi,
    };
  },
  mounted() {
    const children = this.$el.parentNode.children;
    for (let i = 0; i < children.length; i += 1) {
      if (children[i] === this.$el) {
        this.index = i;
        break;
      }
    }
    const self = this;
    channel.$on('activeIndexChanged', (activeIndex) => {
      if (activeIndex !== self.index) {
        self.expanded = false;
      } else {
        self.expanded = true;
      }
    });
  },
  methods: {
    onClick() {
      this.expanded = !this.expanded;
      if (this.expanded) {
        if (!this.$parent.multi) {
          channel.$emit('activeIndexChanged', this.index);
        }
      }
    },
    // getHeight() {
    //   return this.expanded ? `${parseInt(this.contentHeight, 10) + 50}px` : '50px';
    // },
  },
  computed: {
    wrapIconClass() {
      return cx(this.iconClass, {
        rotated: this.expanded,
      });
    },
    wrpsStyle() {
      if (!this.expanded) {
        return {
          // height: '50px',
        };
      }
      return {
        height: 'auto',
      };
    },
  },
};
</script>