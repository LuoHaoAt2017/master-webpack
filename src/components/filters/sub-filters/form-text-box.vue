<template>
    <div class="form-text bd-bot" v-show="formVal.IsDisplay">
        <div class="param-title">{{formVal.DisplayName}}</div>
        <div class="param-value">
          <input type="text" v-model="value" :placeholder="placeholder">
        </div>
        <div class="icon h3yun_All icon-reset p-a" @click="reset" v-show="value"></div>
    </div>
</template>
<script>
// zyq;
export default {
  name: 'FormTextBox',
  props: ['formVal'],
  data() {
    return {
      value: '',
      placeholder: '请输入',
      //isFocus: false,
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
      if (this.formVal.DefaultValue) {
        this.setValue(this.formVal.DefaultValue);
      }
    },
    getValue() {
      this.backUpValue = null;
      if (this.value.trim()) {
        return this.value.trim().replace(/[\,\;\，\；]/ig, ';').split(';');
      }
      return [];
    },
    setValue(val) {
      this.value = val;
    },
    reset() {
      this.backUpValue = this.value;
      this.value = '';
    },
    rollBack() {
      if (this.backUpValue) {
        this.value = this.backUpValue;
      }
    },
    /*
     * @deprecated focus, blur方法
     * changed by linxh@author.com
     * description 删除按钮的显示完全可以通过value值的有无控制，不需要通过infocus，blue冗余
    */
    /*focus() {
      this.isFocus = true;
    },
    blur() {
      this.isFocus = false;
    }*/
  },
};
</script>

<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}:  @px/@baseFontSize * 1rem;
}
.form-text {
  position: relative;
  .px2rem(padding,24);
  display: flex;
  align-items: center;
  .p-a:before{
    content: "\E994";
  }
}


input::-webkit-input-placeholder {
    /* placeholder颜色  */
    //color: red;
    /* placeholder字体大小  */
    .px2rem(font-size,28);
    /* placeholder位置  */
    //text-align: right;
}

</style>
