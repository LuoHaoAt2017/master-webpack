<template>
  <div
    class="h3-cell"
    :class="{
      'h3-tap-active': isLink || !!link,
      'h3-cell_access': isLink || !!link,
      'h3-cell-no-border-intent': !borderIntent,
      'h3-cell-disabled': disabled
    }"
    :style="style"
    @click="onClick">
    <div class="h3-cell__hd">
      <slot name="icon"></slot>
    </div>
    <div class="h3-cell-bd" :class="{'h3-cell-primary': primary === 'title' && valueAlign !== 'left'}">
      <p>
        <label class="h3-label" :style="labelStyles" :class="labelClass" v-if="title || hasTitleSlot">
          <slot name="title">{{ title }}</slot>
        </label>
        <div class="h3-field-label-tip" ref="trigger" v-if="tip" @click="toggleTip">
          <!-- <icon v-if="tip" type="question-circle-o"></icon> -->
          <i class="icon aufont question-circle-o" v-if="tip"></i>
        </div>
        <slot name="after-title"></slot>
      </p>
      <inline-desc>
        <slot name="inline-desc">{{ inlineDesc }}</slot>
      </inline-desc>
    </div>
    <!-- <div class="h3-cell__ft" :class="valueClass"> -->
    <div class="h3-cell__ft">
      <slot name="value"></slot>
      <slot>{{ value }}</slot>
    </div>
    <slot name="child"></slot>
    <div class="h3-cell_icon">
      <slot name="icon"></slot>
    </div>
  </div>
</template>

<script>
import InlineDesc from '../h3-inline-desc';
import { go } from '../../libs/router';
import cleanStyle from '../../utils/clean-style';
import getParentProp from '../../utils/get-parent-prop';

export default {
  name: 'h3-cell',
  components: {
    InlineDesc,
  },
  props: {
    title: [String, Number],
    value: [String, Number, Array],
    isLink: Boolean,
    isLoading: Boolean,
    inlineDesc: [String, Number],
    primary: {
      type: String,
      default: 'title',
    },
    link: [String, Object],
    valueAlign: [String, Boolean, Number],
    borderIntent: {
      type: Boolean,
      default: true,
    },
    disabled: Boolean,
    arrowDirection: String, // down or up
    alignItems: String,
    tipVisible: false,
  },
  beforeMount() {
    this.hasTitleSlot = !!this.$slots.title;
  },
  computed: {
    labelStyles() {
      return cleanStyle({
        width: getParentProp(this, 'labelWidth'),
        textAlign: getParentProp(this, 'labelAlign'),
        marginRight: getParentProp(this, 'labelMarginRight'),
      });
    },
    valueClass() {
      return {
        'h3-cell-primary': this.primary === 'content' || this.valueAlign === 'left',
        'h3-cell-align-left': this.valueAlign === 'left',
        'h3-cell-arrow-transition': !!this.arrowDirection,
        'h3-cell-arrow-up': this.arrowDirection === 'up',
        'h3-cell-arrow-down': this.arrowDirection === 'down',
      };
    },
    labelClass() {
      return {
        'h3-cell-justify': getParentProp(this, 'justify') === 'justify',
      };
    },
    style() {
      if (this.alignItems) {
        return {
          alignItems: this.alignItems,
        };
      }
      return {};
    },
  },
  methods: {
    onClick() {
      if (!this.disabled) {
        go(this.link, this.$router);
      }
    },
    toggleTip() {
      this.tipVisible = !this.tipVisible;
      this.$emit('onToggleTip', this.tipVisible);
    },
  },
  data() {
    return {
      hasTitleSlot: true,
      hasMounted: false,
    };
  },
};
</script>

<style lang="less">
@import '../../styles/mixins.less';
@import '../../styles/tap.less';
@import '../../styles/setArrow.less';
@import '../../styles/h3-ui/h3-cell.less';
@import '../../styles/h3-ui/h3-loading.less';

.h3-cell-primary {
  flex: 1;
}
.h3-label {
  display: block;
  word-wrap: break-word;
  word-break: break-all;
}
.h3-cell__ft .h3-loading {
  display: block;
}
.h3-cell__ft.h3-cell-align-left {
  text-align: left;
}
.h3-cell.h3-cell-no-border-intent:before {
  left: 0;
}
.h3-cell_access .h3-cell__ft.h3-cell-arrow-down:after {
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(90deg);
}
.h3-cell_access .h3-cell__ft.h3-cell-arrow-up:after {
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-90deg);
}
.h3-cell-arrow-transition:after {
  transition: transform 300ms;
}
.h3-cell-disabled {
  .h3-label {
    color: #b2b2b2;
  }
  &.h3-cell_access .h3-cell__ft:after {
    border-color: @cell-disabled-arrow-color;
  }
}
</style>