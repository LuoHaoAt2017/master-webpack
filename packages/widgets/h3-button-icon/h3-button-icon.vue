<template>
  <div :class="wrapCls" :style="h3Style">
    <div :class='contentCls'  @click.stop="click">
        <!-- <i :class="`icon-${icon}`"></i> -->
        <h3-icon :type="icon" size='24'></h3-icon>
    </div>
    <div class="describe"><slot></slot></div>
  </div>
</template>
<script>
import cx from 'classnames';
import H3Icon from '../h3-icon/index.vue';

const prefixCls = 'h3-icon-button';
export default {
  name: 'h3-icon-button',
  components: {
    H3Icon,
  },
  props: {
    className: String,
    h3Style: Object,
    type: {
      type: String,
      default: 'default',
    },
    icon: {
      type: String,
      default: 'setting',
    },
    onClick: Function,
  },
  data() {
    return {
    };
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`, this.className);
    },
    contentCls() {
      return cx('item-icon', `item-icon-${this.type}`);
    },
  },
  methods: {
    click(e) {
      if (this.onClick) {
        this.onClick(e);
      }
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
.h3-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .px2rem(margin-top, 64);
  .px2rem(margin-bottom, 64);
  .item-icon {
    border-radius: 50%;
    .px2rem(width, 96);
    .px2rem(height, 96);
    z-index: 2;
    transition: all 1s;
    display: flex;
    align-items: center;
    justify-content: center;
    &-default{
      background-color: #FDFDFF;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.12);
    }
    &-primary{
      position: absolute;
      background-color: #108ee9;
      .px2rem(right, 44);
      .px2rem(bottom, 146);
      box-shadow: 0 0 0.8rem rgba(16, 142, 233, 0.5);
    }
    i {
      color: #cccccc;
      font-weight: 800;
    }
  }
  .describe {
    .px2rem(margin-top, 16);
    .px2rem(font-size, 24);
    color: #999999;
  }
}

</style>