<template>
  <div class="h3-timeline-node-wrapper">
    <div class="staticTitle" :class="isIos ? 'sticky': ''">
      <slot name="timeHeader"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script>

export default {
  name: 'h3-timeline-node',
  computed: {
    isIos() {
      return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    },
  },
};
</script>
<style lang="less">

</style>


