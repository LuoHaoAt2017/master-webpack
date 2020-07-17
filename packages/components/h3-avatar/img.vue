<template>
  <img class="h3-avatar" :class="className" :src="imgSrc" :style="styleObj">
  </div>
</template>

<script>
export default {
  name: 'h3-avatar-img',
  props: {
    className: String,
    styleObj: Object,
    src: String,
  },
  data() {
    return {
      defaultSrc: 'https://img.alicdn.com/tps/TB1.IgIKpXXXXbgXpXXXXXXXXXX-116-116.png',
    };
  },
  computed: {
    imgSrc() {
      return this.src || this.defaultSrc;
    },
  },
};
</script>



