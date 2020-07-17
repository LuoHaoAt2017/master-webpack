<template>
  <div :class="wrapClass" @click="onClick" v-if="!this.closed"> 
    <div :class="textCls">
      <slot></slot>
    </div>
    <h3-touch :activeClassName="activeCls" v-if="closable && !disabled && !small">
      <div
        :class="closeCls"
        role="button"
        @click="onTagClose"
        aria-label="remove tag"
      >
        <h3-icon @click.native="onTagClose" type="close-circle-o" size="xs" aria-hidden="true" />
      </div>
    </h3-touch>
  </div>
</template>

<script>
import cx from 'classnames';
import H3Touch from '../h3-touch';
import H3Icon from '../h3-icon';

const prefixCls = 'h3-tag';

export default {
  name: 'h3-tag',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    closable: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    onChange: Function,
    onClose: Function,
    afterClose: Function,
  },
  components: {
    H3Touch,
    H3Icon,
  },
  data() {
    return {
      isSelected: this.selected,
      closed: false,
    };
  },
  methods: {
    onClick() {
      if (this.disabled) {
        return;
      }
      const isSelect = this.isSelected;
      this.isSelected = !isSelect;
      if (this.onChange) {
        this.onChange(!isSelect);
      }
    },
    onTagClose() {
      if (this.onClose) {
        this.onClose();
      }
      this.closed = true;
      if (this.afterClose) {
        this.afterClose();
      }
    },
  },
  computed: {
    wrapClass() {
      return cx(prefixCls, {
        [`${prefixCls}-normal`]:
          !this.disabled && (!this.isSelected || this.small || this.closable),
        [`${prefixCls}-small`]: this.small,
        [`${prefixCls}-active`]:
          this.isSelected && !this.disabled && !this.small && !this.closable,
        [`${prefixCls}-disabled`]: this.disabled,
        [`${prefixCls}-closable`]: this.closable,
      });
    },
    activeCls() {
      return `${prefixCls}-close-active`;
    },
    closeCls() {
      return `${prefixCls}-close`;
    },
    textCls() {
      return `${prefixCls}-text`;
    },
  },
};
</script>

<style lang="less">
@import './style/index.less';
</style>


