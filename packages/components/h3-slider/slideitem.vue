<template>
  <div class="h3-slide-item">
    <div :class="wrapCls" style="height: 100%;">
      <slot></slot>
      <div :class="wrapTitleCls" v-if="title">
        <div>
          {title}
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
const prefixCls = 'h3';

export default {
  name: 'h3-slide-item',
  props: {
    title: String,
    showTitle: Boolean,
  },
  computed: {
    wrapCls() {
      return `${prefixCls}-slide-item-inner`;
    },
    wrapTitleCls() {
      return `${prefixCls}-slide-item-title`;
    },
  },
};
</script>

