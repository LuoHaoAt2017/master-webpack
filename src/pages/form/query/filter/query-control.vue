<template>
  <div class="query-filter-control-wrapper bd-bot">
    <div class="title">
      {{ title }}
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'query-filter-control-wrapper',
})
export default class QueryFilterControlWrapper extends Vue {
  @Prop() title!: string;
}

</script>
<style lang='less' scoped>
@import '../../../../styles/common';

.query-filter-control-wrapper {
  .px2rem(padding-left, 30);
  .px2rem(padding-right, 30);
  .px2rem(padding-top, 16);
  .px2rem(padding-bottom, 16);
  background: #fff;
  .title {
    .px2rem(height, 44);
    .px2rem(line-height, 44);
    .px2rem(font-size, 28);
    font-family:PingFangSC-Semibold,PingFang SC;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight:600;
    color:rgba(51,51,51,1);
  }
  .body {
    .px2rem(margin-top, 4);
  }
  /deep/ .h3think-input__input {

    &::-webkit-input-placeholder {
      color: #999;
    }
  }
  /deep/ .h3think-icon {
    margin-right: 5px;
    color: #999;
    font-size: 12px;
  }
}
</style>
