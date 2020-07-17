<template>
  <l-label
    :title="title"
    :required="false"
  >
    <ul class="checkbox-group-list">
      <li
        v-for="(item, index) in list"
        :key="index"
        class="item"
        :class="{'selected': value.includes(item.value)}"
        @click="select(item.value)"
      >
        <span class="icon-box">
          <i
            class="icon h3yun_All check"
          ></i>
        </span>
        <span class="label">{{item.label}}</span>
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
  name: 'Verify',
  components: {
    LLabel
  }
})
export default class Verify extends Vue {
  @Prop()
  list!: [];

  @Prop()
  value!: any[];

  @Prop()
  title!: string;

  select(value: number) {
    let val = value;
    if(this.value.includes(value)) {
      val = value - 1;
    }
    this.$emit('change', val);
  }
}
</script>

<style lang='less' scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.checkbox-group-list {
  display: flex;
  justify-content: flex-start;
  .px2rem(border-radius, 4);
  .item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    .px2rem(margin-top, 12);
    .px2rem(margin-right, 40);
    .icon-box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .px2rem(width, 32);
      .px2rem(height, 32);
      border: 1.2px solid #b4b7bc;
      border-radius: 2px;
    }
    .icon {
      font-size: 16/32;
      color: transparent;
    }
    &.selected {
      .icon {
        color: #107ff0;        
      }
      .icon-box {
        border: 1.2px solid #107ff0;
      }

    }
  }
  .label {
    .px2rem(margin-left, 14);
    .px2rem(font-size, 30);
    color: #333;
  }
}
</style>
