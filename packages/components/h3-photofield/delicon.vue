<template>
  <div style="display:inline-block;line-height:0;border-radius:50%;background:#fff;"  @click="handleClick">
    <div style="position:relative;">
      <i class="aufont icon-base-close-circle" ></i>
      <div style="position:absolute;top:0;left:0;width:100%;height:100%;" class="h3-icon-mask" >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'h3-photo-del-icon',
  methods: {
    handleClick() {
      this.$emit('onClick');
    },
  },
};
</script>

