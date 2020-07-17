<template>
  <i :class="className" @click="iconCick($event)"></i>
</template>

<script>
export default {
  name: 'h3-icon',
  props: {
    type: String,
    defualt: '',
  },
  methods: {
    iconCick(event) {
      this.$emit('onClick', event);
    },
  },
  computed: {
    className() { // compatible with old type param
      return `h3-icon aufont h3-icon-${this.type}  h3_icon_${this.type} icon-base-${this.type.replace(/_/g, '-')}`;
    },
  },
};
</script>

<style lang="less">
@import '../../styles/icon/iconfont.css';

@icon-size-md: 22px;
@icon-size-xxs: 15px;
@icon-size-xs: 18px;
@icon-size-lg: 36px;
@icon-size-sm: 21px;

.h3-icon {
  fill: currentColor;
  background-size: cover;
  width: @icon-size-md;
  height: @icon-size-md;
  // line-height: @icon-size-md;
  text-align: center;
  line-height: @icon-size-md;
  &-xxs {
    width: @icon-size-xxs;
    height: @icon-size-xxs;
  }

  &-xs {
    width: @icon-size-xs;
    height: @icon-size-xs;
  }

  &-sm {
    width: @icon-size-sm;
    height: @icon-size-sm;
  }

  &-md {
    width: @icon-size-md;
    height: @icon-size-md;
  }

  &-lg {
    width: @icon-size-lg;
    height: @icon-size-lg;
  }

  
  &-loading::before {
    display: inline-block;
    animation: cirle-anim 1s linear infinite;
  }

  @keyframes cirle-anim {
    100% {
      transform: rotate(360deg);
      transform-origin: center center;
    }
  }
}
</style>


