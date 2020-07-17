<template>
  <div class="open-query-body">
    <open-query-filter
      :columns="columns"
      :controls="controls"
      class="open-query-body__filter"
      @change="change"
    />
    <!-- <div class="open-query-body__button" :class="{active: canSearch}" @click="search">
      查询
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import OpenQueryFilter from './filter/index.vue';
@Component({
  name: 'open-query-body',
  components: {
    OpenQueryFilter,
  },
})
export default class OpenQueryBody extends Vue {
  @Prop()
  columns!: any[];

  @Prop()
  controls!: any;

  @Prop({
    type: Array,
    default: () => [],
  })
  tableColumns!: any; // 渲染显示的列

  change (val) {
    this.$emit('change', val);
  }
}

</script>
<style lang='less' scoped>
@import '../../../styles/common';
.open-query-body{
  // height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  .px2rem(bottom, 148);
  overflow-y: auto;
  &__filter {
    position: relative;
    // top: 0;
    // left: 0;
    // width: 100%;
    // .px2rem(bottom, 148);
    // overflow-y: auto;
  }
  // &__button {
  //   position: absolute;
  //   .px2rem(bottom, 30);
  //   .px2rem(left, 30);
  //   .px2rem(right, 30);
  //   .px2rem(height, 88);
  //   .px2rem(line-height, 88);
  //   background:rgba(235,237,242,1);
  //   .px2rem(border-radius, 44);
  //   text-align: center;
  //   .px2rem(font-size, 30);
  //   font-family:PingFangSC-Regular,PingFang SC;
  //   color:rgba(204,204,204,1);
  //   &.active {
  //     background: #107fff;
  //     color: #fff;
  //   }
  // }
}
</style>
