<template>
  <button class="h3-swipeout-button"
  :class="wrapClass" :style="{width: `${width}px`, backgroundColor: backgroundColor}" @click="onButtonClick" type="button">
    <slot>{{text}}</slot>
  </button>
</template>

<script>
const prefixCls = 'h3-swipeout-button-';

export default {
  name: 'h3-swipeout-button',
  props: {
    text: {
      type: String,
    },
    backgroundColor: String,
    type: {
      type: String,
      default: 'default',
    },
    width: {
      type: Number,
      default: 80,
    },
  },
  methods: {
    onButtonClick() {
      this.$parent.onItemClick(this.text);
    },
  },
  computed: {
    wrapClass() {
      return `${prefixCls}${this.type}`;
    },
  },
};
</script>