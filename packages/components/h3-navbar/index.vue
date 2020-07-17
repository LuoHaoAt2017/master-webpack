<template>
  <div class="h3-navbar" :class="wrapClass">
    <slot name="left">
      <div class="h3-navbar-left" @click="onLeftClick">
        <div class="h3-navbar-button" >
          <h3-icon type="left" style="font-size:20px" ></h3-icon>
        </div>
         
      </div>
    </slot>
    <div class="h3-navbar-title" >
      {{title}}
      <slot></slot>
    </div>
    <slot name="right">
      <div class="h3-navbar-right" >
        <div class="h3-navbar-button" v-for="(button, index) in rightButtons" v-if="rightButtons && rightButtons.length>0" @click="onRightButtonClick(index)" >
          <h3-icon :type="button.icon" v-if="button.icon"></h3-icon>
          <span v-if="!button.icon">
            {{button.text}}
          </span>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import H3Icon from '../h3-icon';

export default {
  name: 'h3-navbar',
  components: {
    H3Icon,
  },
  props: {
    className: {
      type: String,
    },
    title: String,
    mode: {
      type: String,
      default: 'dark',
      validator(value) {
        if (value) {
          if (value === 'dark' || value === 'light') {
            return true;
          }
          return false;
        }
        return true;
      },
    },
    onLeftClick: {
      type: Function,
      default: () => {},
    },
    rightButtons: Array, // {icon,onPress,text}
  },
  methods: {
    onRightButtonClick(index) {
      if (this.rightButtons && this.rightButtons.length > 0) {
        const button = this.rightButtons[index];
        button.onPress();
      }
    },
  },
  computed: {
    wrapClass() {
      return `h3-navbar-${this.mode}`;
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../styles/index';
@import '../../styles/mixins';

@navbar-height: 45 * @hd;
@navbarPrefixCls: h3-navbar;

.@{navbarPrefixCls} {
  display: box;
  display: -webkit-box;
  display: flex;
  align-items: center;
  height: @navbar-height;
  background-color: @brand-primary;
  color: @fill-base;

  &-left,
  &-title,
  &-right {
    flex: 1;
    height: 100%;
    display: box;
    display: -webkit-box;
    display: flex;
    align-items: center;
  }

  &-left {
    padding-left: @h-spacing-lg;
    font-size: @link-button-font-size;

    &-icon {
      margin-right: @h-spacing-sm;
      display: inherit;
    }
  }

  &-title {
    justify-content: center;
    font-size: 18 * @hd;
    white-space: nowrap;
  }

  &-right {
    justify-content: flex-end;
    font-size: @link-button-font-size;
    margin-right: @h-spacing-lg;
  }

  &-light {
    background-color: @fill-base;
    color: @brand-primary;
  }

  &-light &-title {
    color: @color-text-base;
  }

  &-button {
    height: 100%;
    display: flex;
    align-items: center;
    /* justify-content: center; */
    text-align: center;
    padding: 0 8px;
    
    
  }
  &-left &-button{
    padding-left: 0;
  }
  &-button .h3-icon {
    font-size: 22px;
  }

}

</style>

