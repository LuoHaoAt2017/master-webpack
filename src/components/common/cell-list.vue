<template>
  <div class="cell-list">
    <div class="cell-list__top">
      <template v-if="dashed">
        <div class="cell-list__top--dashed">
          <slot></slot>
        </div>
      </template>
      <template v-else>
        <skeleton
          class="cell-list__top--loading"
          v-show="loading"
        ></skeleton>
        <div
          class="cell-list__top--img"
          v-if="address"
          v-show="!loading"
        >
          <img :src="address">
        </div>
        <div
          :style="iconWrapperStyle"
          :class="['cell-list__top--icon', {light: isLight}, iconType]"
          v-if="iconName || isLight"
          v-show="!loading"
        >
          <i
            v-if="defaultIcon"
            :style="iconStyle"
            class="fa box-icon h3yun_All table-o"
          ></i>
          <i
            v-else
            :style="iconStyle"
            class="fa box-icon h3yun_All"
            :class="[this.iconType === 'line' ? `${iconName}-o` : `${iconName}`]"
          ></i>
          <img
            v-if="isLight"
            class="light-app-tag"
            src="../../assets/img/light-app-tag.svg"
          />
        </div>
      </template>
    </div>
    <div class="cell-list__bottom" :style="{'margin-top': (iconType === 'line' && !dashed) ? '0.133rem' : '0.213rem'}">
      <template v-if="loading">
        <div class="cell-list__bottom--loading">
          <skeleton class="bar"></skeleton>
          <skeleton
            class="bar"
            style="width: 50%"
          ></skeleton>
        </div>
      </template>
      <template v-else>
        <div
          class="cell-list__bottom--name"
          v-if="!isHtml"
        >{{name}}</div>
        <div
          class="cell-list__bottom--name"
          v-else
          v-html="name"
        ></div>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import skeleton from '@/components/common/skeleton-loading.vue';
import calcIconColor from '../../utils/calc-icon-color';

@Component({
  components: {
    skeleton
  }
})
export default class CellList extends Vue {
  @Prop({ default: false })
  loading!: boolean;

  @Prop({
    default: 'line',
    validator: value => {
      return ['round', 'line'].indexOf(value) !== -1;
    }
  })
  iconType!: string;

  @Prop({ default: '' })
  iconName!: string;

  @Prop({ default: '' })
  address!: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  id!: string;

  @Prop({ default: false })
  dashed!: boolean;

  @Prop({ default: false })
  isLight: boolean;

  @Prop({ default: false })
  isHtml: boolean;

  @Prop({ default: 0 })
  iconColorIndex: number;

  // 应用颜色
  appColorMap: string[] = [
    '#2F3489',
    '#777F8D',
    '#FF3640',
    '#FA541C',
    '#EB2F96',
    '#FADB14',
    '#52C41A',
    '#06D1A2',
    '#23B7FF',
    '#2565F1',
    '#7481FE',
    '#722ED1'
  ];

  get iconWrapperStyle(): string {
    if (this.iconType === 'line') {
      return `color: ${this.getIconColor(this.id)}`;
    } else {
      return `background: ${this.handleIconColor(
        this.id,
        this.iconColorIndex
      )}`;
    }
  }
  get iconStyle(): string {
    if (this.iconType === 'line') {
      return `font-size: 0.67rem`;
    } else {
      return `color: #fff; font-size: 0.75rem`;
    }
  }

  getIconColor(id) {
    return calcIconColor(id);
  }

  get defaultIcon() {
    return !this.iconName && this.isLight;
  }

  /**
   * 处理应用图标修改
   */
  handleIconColor(id, iconColor) {
    // iconColor为０时根据id取色值
    if (iconColor === 0) {
      return calcIconColor(id);
    } else {
      return this.appColorMap[iconColor - 1];
    }
  }
}
</script>
<style lang="less" scoped>
@baseFontSize: 75;
@baseThemeColor: #1890ff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.cell-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  .px2rem(width, 160);
  .px2rem(padding-top, 10);
  .px2rem(padding-bottom, 10);
  // .px2rem(padding, 30);
  // background: #fff;
  // transition: background 0.2s;
  // &:active {
  //   background: #f6fafd;
  // }
  &__top {
    .px2rem(width, 88);
    .px2rem(height, 88);
    &--dashed {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border: 1px dashed #0080ff;
      .px2rem(border-radius, 12);
      background: #f2f8ff;
    }
    &--img {
      position: relative;
      padding-bottom: 100%;
      width: 100%;
      height: 0;
      overflow: hidden;
      .px2rem(border-radius, 12);
      box-shadow: 0 0 4px 0 rgba(100, 100, 100, 0.08);
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    &--icon {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      background: transparent;
      .px2rem(border-radius, 12);
      .px2rem(width, 88);
      .px2rem(height, 88);
      i {
        .px2rem(font-size, 88);
      }
      .light-app-tag {
        position: absolute;
        .px2rem(right, -4);
        .px2rem(bottom, -4);
        width: 100%;
        height: 100%;
      }
    }
    &--loading {
      .px2rem(width, 88);
      .px2rem(height, 88);
      padding: 0;
      .px2rem(border-radius, 8);
    }
  }
  &__bottom {
    &--loading {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .px2rem(width, 100);
      height: 34px;
      .bar {
        width: 100%;
        height: 12px;
        .px2rem(border-radius, 6);
      }
    }
    &--name {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      word-break: break-all;
      .px2rem(width, 144);
      .px2rem(height, 70);
      .px2rem(line-height, 35);
      overflow: hidden;
      text-align: center;
      .px2rem(font-size, 26);
      color: #333;
    }
  }
}
</style>
