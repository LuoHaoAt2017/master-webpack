<template>
    <div class="bd-bot scope">
        <div class="scope-title">
            数据范围
        </div>
        <div class="scope-value">
            <div v-for="(scope,index) in formVal.DefaultItems" :key="index" 
            :class="[scope.Active?'active':'']" @click="setScopeActive(scope)">
              {{scope.Value}}
            </div>
        </div>
    </div>
</template>

<script>
  // zyq;
  export default {
  name: 'FormScope',
  props: ['formVal'],
  data() {
  return {
  value: null,
  backUpValue: null,
  };
  },
  created() {
  this.init();
  },
  mounted() {
  // this.$store.state.readyFiltersCount++;
  },
  methods: {
  init() {
  this.setValue(this.formVal.DefaultValue);
  },
  getValue() {
  this.backUpValue = null;
  for (const scope of this.formVal.DefaultItems) {
  if (scope.Active) {
  return scope.Key;
  }
  }
  return null;
  },
  setValue(val) {
  let activeFlag = true;
  for (const scope of this.formVal.DefaultItems) {
  if (scope.Key === val) {
  this.value = val;
  this.$set(scope, 'Active', true);
  activeFlag = false;
  } else {
  this.$set(scope, 'Active', false);
  }
  }
  if (activeFlag) {
    this.value = this.formVal.DefaultItems[0].Key;
    this.$set(this.formVal.DefaultItems[0], 'Active', true);
  }
  },
  reset() {
  // 还原为默认值
  this.backUpValue = this.value;
  this.init();
  },
  rollBack() {
  if (this.backUpValue) {
  this.setValue(this.backUpValue);
  }
  },
  setScopeActive(scope) {
  this.setValue(scope.Key);
  },
  },
  };
</script>

<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.scope {
  .px2rem(padding,24);
  .scope-title {
    text-align: left;
    color: #333;
    .px2rem(font-size,28);
  }
  .scope-value {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    div {
      .px2rem(width,174);
      .px2rem(height,66);
      .px2rem(line-height,66);
      .px2rem(margin-right,24);
      .px2rem(margin-top,20);
      .px2rem(border-radius,10);
      color: #333;
      background-color: #f2f3f5;
      text-align: center;
      &:nth-child(3) {
        margin-right: 0;
      }
      &.active {
        color: #fff;
        background-color: #38adff;
        .px2rem(border-radius,8);
      }
    }
  }
}
</style>
