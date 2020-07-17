<template>
  <div class="bd-bot scope" ref="input">
      <div class="scope-title">{{formVal.DisplayName}}</div>
      <div class="number-value">
          <div class="">
            <input class="num-val" type="number"  v-model="startVal"  
                    :placeholder="minValue">
          </div>            
          <div > 一 </div>
          <div class="">
            <input class="num-val " type="number" v-model="endVal" 
                    :placeholder="maxValue">  
          </div>            
      </div>     
  </div> 
</template>
<script>
// zyq;
export default {
  name: 'FormNumberStamp',
  props: ['formVal'],
  data() {
    return {
      startVal: '',
      endVal: '',
      minValue: '最小值',
      maxValue: '最大值',
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
    // 恢复默认值
    init() {
      this.setValue(this.formVal.DefaultValue);
    },
    getValue() {
      this.backUpValue = null;
      const res = [];
      if (this.startVal) {
        res.push(this.startVal);
      }
      if (this.endVal) {
        res.push(this.endVal);
      }
      return res;
    },
    // focus(){
    //   this.$root.eventHub.$emit('input',this.$refs.input);
    // },
    setValue(val) {
      if (!val) {
        return;
      }
      if (typeof val === 'string') {
        const tempArr = val.split(';');
        if (tempArr.length > 0) {
          this.startVal = tempArr[0];
          this.endVal = tempArr[1];
        }
      } else if (typeof val === 'object') {
        this.startVal = val[0];
        this.endVal = val[1];
      }
    },
    reset() {
      this.backUpValue = {
        startVal: this.startVal,
        endVal: this.endVal,
      };
      this.startVal = null;
      this.endVal = null;
    },
    rollBack() {
      if (this.backUpValue) {
        this.startVal = this.backUpValue.startVal;
        this.endVal = this.backUpValue.endVal;
      }
    },
  },
};
</script>
<style lang = "less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.number-value {
  display: flex;
  justify-content: space-between;
  background-color: #f2f3f5;
  .px2rem(height,66);
  .px2rem(margin-top,20);
  .px2rem(border-radius,10);
  align-items: center;
  div {
    color: #999;
    .px2rem(width,240);
    text-align: center;
    &:first-child {
      .px2rem(padding-left,8);
    }
    &:last-child {
      .px2rem(padding-right,8);
    }
    &:nth-child(2) {
      .px2rem(width,74);
    }
    input.num-val {
      .px2rem(width,240);
      .px2rem(height,50);
      .px2rem(font-size,24);
      text-align: center;
      color: #999;
    }
    input.num-val::-webkit-input-placeholder {
      .px2rem(font-size,28);
      color: #999;
    }
  }
}
</style>


