<template>
  <div class="open-query-title" :class="[themeClass]">
    <div class="image"></div>
    <div class="title">
      {{ title }}
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'open-query-title',
  components: {
  },
})
export default class OpenQueryTitle extends Vue {
  @Prop() title!: string;

  @Prop() themeIndex!: number;

  // 主题样式
  get themeClass () {
    const prefix = 'open-query-title__theme_';
    return this.themeIndex ? prefix + this.themeIndex : `${prefix}0`;
  }
}
</script>

<style lang="less" scoped>
@import './styles/theme.less';
@openquerytitleCls: open-query-title;
@baseFontSize: 75;

.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}

.@{openquerytitleCls} {
  position: relative;
  .px2rem(height, 96);
  display: flex;
  align-items: center;
  justify-content: center;
  & > .image {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  & > .title {
    .px2rem(font-size, 34);
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(255,255,255,1);
    z-index: 99;
    text-align: center;
  }
  &__theme_0 {
    .themeHeader('../../../../assets/img/theme/theme-0.png');
  }

  &__theme_1 {
    .themeHeader('../../../../assets/img/theme/theme-1.png');
  }

  &__theme_2 {
    .themeHeader('../../../../assets/img/theme/theme-2.png');
  }

  &__theme_3{
    .themeHeader('../../../../assets/img/theme/theme-3.png');
  }

  &__theme_4 {
    .themeHeader('../../../../assets/img/theme/theme-4.png');
  }
}

</style>
