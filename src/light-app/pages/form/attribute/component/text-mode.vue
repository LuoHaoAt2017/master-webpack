<template>
  <l-label
    title="格式"
    :required="false"
    class="mode-box"
  >
    <ul class="mode-list">
      <li
        v-for="item in list"
        :key="item.value"
        @click="choiceFormatter(item.value)"
        :class="[item.value == selected ? 'selected icon-control-item': 'icon-control-item']"
      >
        <div class="icon-box">
          <span class="icon-box">
            <i :class="['icon', 'h3yun_All', item.icon]"></i>
          </span>
        </div>
        <div class="name">{{item.label}}</div>
      </li>
    </ul>
  </l-label>
</template>

<script lang='ts'>
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { LLabel } from '@/light-app/components';
@Component({
  name: 'TextMode',
  components: {
    LLabel
  }
})
export default class TextMode extends Vue {
  @Prop()
  list!: object;

  @Prop()
  defaultValue!: string;

  selected: string = '';

  created() {
    this.selected = this.defaultValue;
  }

  choiceFormatter(formatter) {
    this.selected = formatter;
    this.$emit('click', formatter);
  }
}
</script>

<style lang='less' scoped>
@import '~@/styles/form-base.less';
.mode-box {
  .mode-list {
    display: flex;
    justify-content: space-between;
  }
  .icon-control-item {
    .px2rem(width, 150);
    .px2rem(height, 140);
    .px2rem(border-radius, 16);
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    text-align: center;
    .name {
      .px2rem(font-size, 24);
      color: #666;
    }
    .icon-box {
      margin: 0 auto;
      .px2rem(width, 48);
      .px2rem(height, 48);
      .px2rem(margin-top, 30);
      .px2rem(margin-bottom, 10);
      .icon {
        .px2rem(font-size, 48);
        color: #6c7482;
      }
    }
    &.selected {
      border: 0;
      color: #fff;
      background: @lightAppPrimaryColor;
      .icon {
        color: #fff;
      }
      .name {
        color: #fff;
      }
    }
  }
}
</style>
