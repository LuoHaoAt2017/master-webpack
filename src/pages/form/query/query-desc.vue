<template>
  <div class="open-query-desc">
    <div class="open-query-desc__body" :class="[toggleCls]">
      <p ref="desc" class="open-query-desc__content">
        {{ desc }}
      </p>
      <div v-if="showToggle" class="open-query-desc__toggle" @click="toggle">
        <span v-if="collapsed">...</span>
        <span class="text">{{ toggleText }}</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'open-query',
  components: {
  },
})
export default class OpenQuery extends Vue {
  @Prop() desc!: string;

  collapsed = true;

  showToggle = false;

  get toggleText () {
    if (this.collapsed) {
      return '展开';
    }
    return '收起';
  }

  get toggleCls () {
    if (this.showToggle && !this.collapsed) {
      return 'open-query-desc__body-expand';
    }
    return '';
  }

  mounted () {
    this.$nextTick(() => {
      const height = (this.$refs.desc as any).offsetHeight;
      if (height > 40) {
        this.showToggle = true;
      } else {
        this.showToggle = false;
      }
      this.$emit('ready');
    });
  }

  toggle () {
    this.collapsed = !this.collapsed;
    this.$emit('toggle');
  }
}

</script>

<style lang="less" scoped>
@baseFontSize: 75;

.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.open-query-desc {
  .px2rem(padding-left, 30);
  .px2rem(padding-right, 30);
  .px2rem(padding-top, 8);
  .px2rem(padding-bottom, 8);
  background: #F5F7F9;
  &__body {
    position: relative;
    .px2rem(max-height, 80);
    overflow: hidden;
  }
  &__body-expand {
    max-height: 1000px;
  }

  &__content {
    display: inline;
    .px2rem(line-height, 40);
    .px2rem(font-size, 24);
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(102,102,102,1);
  }
  &__toggle {
    position: absolute;
    bottom: 0;
    right: 0;
    .px2rem(height, 33);
    .px2rem(line-height, 33);
    .px2rem(font-size, 24);
    font-family:PingFangSC-Regular,PingFang SC;
    background: #F5F7F9;
    & > .text {
      .px2rem(margin-left, 48);
      color:rgba(37,101,241,1);
    }
  }

}
</style>
