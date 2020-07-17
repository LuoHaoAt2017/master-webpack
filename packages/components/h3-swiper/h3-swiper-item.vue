<template>
  <div class="h3-swiper-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'h3-swiper-item',
  mounted() {
    this.$nextTick(() => {
      this.$parent.rerender();
    });
  },
  beforeDestroy() {
    const $parent = this.$parent;
    this.$nextTick(() => {
      $parent.rerender();
    });
  },
};
</script>
