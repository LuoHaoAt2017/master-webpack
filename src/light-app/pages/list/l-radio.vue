<template>
  <l-label
    :title="title"
    :required="false"
  >
    <ul class="radio-list">
      <li
        v-for="(item, index) in list"
        :key="index"
        class="item bd-top"
        @click="select(item)"
      >
        <span class="icon-box">
          <i
            class="icon h3yun_All"
            :class="[selected === item.value ? 'check-circle selected' : 'circle-o']"
          ></i>
        </span>
        <span class="label">{{ item.label }}</span>
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
  name: 'LRadio',
  components: {
    LLabel,
  },
})
export default class LRadio extends Vue {
  @Prop()
  list!: [];

  @Prop()
  defaultValue!: number;

  @Prop()
  title!: string;

  selected: number = -1;

  created () {
    this.selected = this.defaultValue;
  }

  select (item) {
    this.selected = item.value;
    this.$emit('click', item.value);
  }

  @Watch('defaultValue')
  valueChange (val) {
    if (val) {
      this.selected = val;
    }
  }
}
</script>

<style lang='less' scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.radio-list {
  .px2rem(border-radius, 4);
  border: 1px solid #d8d8d8;
  .item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    .px2rem(height, 88);
  }
  .icon-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .px2rem(width, 30);
    .px2rem(height, 30);
    .px2rem(margin-left, 24);
  }
  .icon {
    color: #b4b7bc;
    &.selected {
      color: #107ff0;
    }
  }
  .label {
    .px2rem(margin-left, 28);
    .px2rem(font-size, 30);
    color: #333;
  }
}
</style>
