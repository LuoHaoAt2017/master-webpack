<template>
  <div :class="wrapClasses"  :style="style">
    <slot></slot>
  </div>
</template>

<script>
const prefixList = ['-moz-box-', '-webkit-box-', ''];
const prefixCls = 'h3-flexbox-item';
export default {
  name: 'flexboxitem',
  props: {
    span: [Number, String],
    order: [Number, String],
    className: String,
  },
  beforeMount() {
    this.bodyWidth = document.documentElement.offsetWidth;
  },
  methods: {
    buildWidth(width) {
      if (typeof width === 'number') {
        if (width < 1) {
          return width;
        }
        return width / 12;
      }
      return width.replace('px', '') / this.bodyWidth;
    },
  },
  computed: {
    style() {
      const styles = {};
      const marginName = this.$parent.orient === 'horizontal' ? 'marginLeft' : 'marginTop';
      if (this.$parent.gutter * 1 !== 0) {
        styles[marginName] = `${this.$parent.gutter}px`;
      }

      if (this.span) {
        for (const prefix of prefixList) {
          styles[`${prefix}flex`] = `0 0 ${this.buildWidth(this.span) * 100}%`;
        }
      }
      if (typeof this.order !== 'undefined') {
        styles.order = this.order;
      }
      return styles;
    },
    wrapClasses() {
      return prefixCls;
    },
  },
  data() {
    return {
      bodyWidth: 0,
    };
  },
};
</script>
