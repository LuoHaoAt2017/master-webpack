<template>
  <div class="check-box">
    <ul class="check-list">
      <template v-for="(item,index) in list">
        <li
          class="check-item"
          v-if="!item.inVisible"
          :class="{'bd-bot': index < list.length - 1}"
          :key="item.name"
        >
          <span class="check-item__name">{{item.content}}</span>
          <div class="check-item__switch">
            <h3-switch
              color="#3392FF"
              v-model="checkList[item.name]"
              @onClick="handleChange(item.name)"
            ></h3-switch>
          </div>
        </li>
      </template>

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
import { H3Switch } from 'h3-mobile-vue';
@Component({
  name: 'Check',
  components: {
    H3Switch
  }
})
export default class Check extends Vue {
  @Prop()
  list!: any;
  @Prop()
  attrOptions!: any;

  checkList: object = {};

  created() {
    Object.keys(this.attrOptions).forEach(item => {
      let result = this.attrOptions[item];
      result =  Number(result);
      if (result === 1) {
        result = true;
      } else if (result === 0) {
        result = false;
      }
      this.checkList[item] = result;
    });
  }
  handleChange(name) {
    this.checkList[name] = !this.checkList[name];
    this.$emit('click', this.checkList);
  }
}
</script>

<style lang='less' scoped>
@import '~@/styles/form-base.less';
.check-box {
  background: #fff;
  .check-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .px2rem(margin-left, 32);
    &__name {
      .px2rem(font-size, 30);
      color: #333;
    }
    &__switch {
      padding: 0.34667rem 0.4rem;
    }
  }
}
</style>
