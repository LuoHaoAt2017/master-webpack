<template>
  <div class="h3-sort-list h3-list">
    <div class="h3-list-body">
      <slot>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'h3-sort-list',
  props: {
    list: {
      type: Array,
      default: null,
      required: true,
    },
    leftDragOffset: {
      type: Number,
      default: 0,
    },
    rightDragOffset: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  created() {

  },
  methods: {
    reorderList(originalIndex, targetIndex) {
      if (originalIndex !== targetIndex) {
        const original = this.list.splice(originalIndex, 1)[0];
        this.list.splice(targetIndex, 0, original);
      }
      this.$emit('onOrderChange', {
        list: this.list,
      });
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
// @import '../../styles/themes/default';
  .h3-sort-list{
    width:100%;
  }

</style>
