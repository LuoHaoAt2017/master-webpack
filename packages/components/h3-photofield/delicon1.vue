<template>
  <div style="display:inline-block;line-height:0;border-radius:100%;background:#fff;"  @click="handleClick">
    <div style="position:relative;height: 100%;">
      <i class="aufont icon-base-close-circle" style="font-size: 18px;"></i>
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

