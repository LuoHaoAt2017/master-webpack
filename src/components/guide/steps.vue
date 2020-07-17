<template>
  <div class="steps">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'steps',
  props: {
    current: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    current(newVal, oldVal) {
      if (newVal < oldVal) {
        this.updateChild(true);
      } else {
        this.updateChild();
      }
    },
  },
  mounted() {
    this.updateChild();
  },
  methods: {
    updateChild(reverseMode) {
      const total = this.$children.length;
      if (this.current < 0 || this.current >= total) {
        return;
      }
      this.$children.forEach((child, index) => {
        child.total = total;
        child.stepNumber = index + 1;
        child.isCurrent = false;
        child.isReverse = false;
      });
      if (reverseMode) {
        this.$children[this.current + 1].isReverse = true;
        this.$children[this.current].isReverse = true;
      }
      const timer = setTimeout(() => {
        this.$children[this.current].isCurrent = true;
      }, 150);
      this.$once('hook:deactivated', () => {
        clearTimeout(timer);
      });
    },
  },
};
</script>
<style lang="less" scoped>
.steps {
  display: flex;
  flex-wrap: nowrap;
}
</style>
