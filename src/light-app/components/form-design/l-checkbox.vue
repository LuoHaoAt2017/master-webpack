<template>
  <div :class="autoDefClass">
    <ul class="checkbox-box">
      <li
        class="checkbox-item"
        v-for="(item,index) in attrs.DefaultItems"
        :class="{ 'bd-bot': index < attrs.DefaultItems.length - 1 }"
        :key="index"
      >
        <span class="icon-box" :class="{selected: selected.includes(item)}">
          <span v-if="selected.includes(item)" class="icon h3yun_All check-square-o"></span>
        </span>
        <span class="context">{{item}}</span>
      </li>
    </ul>
  </div>
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
import cx from 'classnames';
@Component({
  name: 'LCheckbox'
})
export default class LCheckbox extends Vue {
  @Prop()
  data!: any;
  @Prop()
  attrs!: any;
  @Prop()
  className?: string;
  selected: [] = [];
  get autoDefClass() {
    return cx('app-checkbox-container', this.className);
  }
  @Watch('attrs')
  attrsListen(newVal) {
    this.init()
  }
  created() {
   this.init()
  }
  init() {
    this.selected = this.attrs.DefaultValue;
  }
}
</script>

<style lang='less' scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.app-checkbox-container {
  .px2rem(padding-bottom, 26);
  .checkbox-box {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    .checkbox-item {
      position: relative;
      .px2rem(height, 88);
      .px2rem(line-height, 88);
      .px2rem(padding-left, 90);
      box-sizing: border-box;
      .icon-box {
        position: absolute;
        .px2rem(left, 26);
        .px2rem(top, 25);
        .px2rem(width, 40);
        .px2rem(height, 40);
        border: 2px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }
      .selected {
        border: 0;
        width: auto;
        height: auto;
        top: 0;
      }
      .icon {
        .px2rem(font-size, 40);
        color: #ccc;
      }
      .context {
        .px2rem(font-size, 30);
        color: #333;
      }
    }
  }
}
</style>
