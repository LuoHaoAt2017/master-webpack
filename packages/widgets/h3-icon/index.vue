<template>
  <i :class="className" 
  @click="iconCick($event)" 
  :style="`color:${color}`"></i>
</template>

<script>
export default {
  name: 'h3-icon',
  props: {
    type: String,
    size: {
      // validator(val) {
      //   const options = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'];
      //   if (options.indexOf(val) > -1) {
      //     return true;
      //   }
      //   return false;
      // },
      type: [Number, String],
      default: '18',
    },
    color: String,
  },
  methods: {
    iconCick(event) {
      this.$emit('onClick', event);
    },
  },
  computed: {
    className() { // compatible with old type param
      return `h3-icon aufont h3-icon-${this.type} h3-icon-${this.size} h3_icon_${this.type} icon-base-${this.type.replace(/_/g, '-')}`;
    },
  },
};
</script>

<style lang="less">
@import '../../styles/mixins';
@import '../../styles/icon/iconfont.css';

@icon-size-xxs: 15px;
@icon-size-xs: 18px;
@icon-size-sm: 21px;
@icon-size-md: 22px;
@icon-size-lg: 36px;

.form-style-icon(@parameter:34){
  // .px2rem(width,@parameter);
  .px2rem(height,@parameter);
  .px2rem(font-size,@parameter);
  .px2rem(line-height,@parameter);
}
.h3-icon {
  fill: currentColor;
  background-size: cover;
  // width: @icon-size-md;
  // height: @icon-size-md;
  text-align: center;
  // line-height: @icon-size-md;

  &-12 {
     .form-style-icon(24);
  }
  &-13 {
     .form-style-icon(26);
  }
  &-14 {
     .form-style-icon(28);
  }
  &-15 {
     .form-style-icon(30);
  }
  &-16 {
     .form-style-icon(32);
  }
  &-17 {
     .form-style-icon(34);
  }
  &-18 {
     .form-style-icon(36);
  }
  &-19 {
     .form-style-icon(38);
  }
  &-20 {
     .form-style-icon(40);
  }
  &-24 {
     .form-style-icon(48);
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


