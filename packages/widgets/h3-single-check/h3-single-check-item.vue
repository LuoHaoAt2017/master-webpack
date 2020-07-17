<template>
  <div>
    <div class="h3-multiple-check-item" @click="selectItem">
      <div class="h3-multiple-check-circle">
        <i class="icon aufont icon-base-ellipsis trigger-ponit"  @click.stop="triggerMultipleCheck"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  name: 'h3-multiple-check-item',
  components: {},
  props: {
    isEditing: {
      type: Boolean,
      default: false,
    },
    itemdata: {
      type: Object,
      default: () => {},
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    triggerMultipleCheck() {
      this.$emit('tigger-multiple-chcek');
    },
    selectItem() {
      if (this.isEditing) {
        this.$emit('select-item');
      }
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@prefixCls: h3-multiple-check;

.@{prefixCls}-item{
  width: 100%;
  .px2rem(height, 150);
  border: 1px solid hotpink;
  .px2rem(padding-right, 30);
  position: relative;
  box-sizing: border-box;
  .@{prefixCls}-circle{
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    .trigger-ponit{
      .px2rem(font-size, 18);
      color: #ccc;
    }
    .select-circle{
      .px2rem(font-size, 44);
      color: #ccc;
    }
    .selected-circle{
      .px2rem(font-size, 44);
      color: #1890ff;
    }
  }
}

</style>

