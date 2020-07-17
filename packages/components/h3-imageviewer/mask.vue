<template>
  <div v-if="visible" :class="className">

  </div>
</template>

<script>
export default {
  name: 'h3-image-viewer-mask',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
    },
  },
};
</script>

