<template>
    <div id="form-check-box" v-show="isVisible">
        <group v-if="formVal.Editable">
            <x-switch class="dp-font30" :class="{'bd-bot':!isInGrid}" @on-change='changeVal' @on-click='onClick' :title="formVal.DisplayName" v-model='value' :inline-desc='requiredVal'>
            </x-switch>
            <span class="value-show dp-font30">{{value?'是':'否'}}</span>
        </group>
        <div class="content" v-if="!formVal.Editable" :class="{'no-border':isInGrid}">
          <div class="left">
            <p class="dp-font30">{{formVal.DisplayName}}<span class="require" v-if="formVal.Required&&formVal.Editable">*</span>
            </p>
          </div>
          <div class="right">
            <!-- <input class="dp-font30" type="text" readonly v-model="readOnlyVal"> -->
            <div class="text dp-font30" v-if="!formVal.Editable">{{readOnlyVal}}</div>
          </div>
        </div>
        <!-- <input type="text" class="cover" readonly v-if="!formVal.Editable"> -->
    </div>
</template>

<script>
import { XSwitch, Group } from 'vux';
import mixin from '../../../mixins/base-controler';

export default {
  name: 'FormCheckbox',
  components: {
    XSwitch,
    Group,
  },
  props: ['formVal', 'keyName', 'ObjectId'],
  data() {
    return {
      requiredVal: '',
      isInGrid: false,
      gridDataField: '',
      value: '',
      isVisible: true,
    };
  },
  // baseControler的方法混入
  mixins: [mixin],
  created() {
    // 判断控件是否在子表内
    if (this.keyName.indexOf('.') > 1) {
      this.isInGrid = true;
      this.gridDataField = this.keyName.split('.')[0];
    }
    // 判断是否是必填
    if (this.formVal.Required) {
      this.requiredVal = '*';
    }
  },
  mounted() {
    if (!this.formVal.Editable) {
      $(this.$el)
        .find('.weui-switch')
        .hide();
    }
    this.InitValue(this.formVal.Value);
  },

  methods: {
    GetValue() {
      return this.value ? this.value : false;
    },
    SetValue(val) {
      this.value = val;
      this.formVal.Value = val;
      this.OnChange();
    },
    InitValue(val) {
      this.value = val;
      this.formVal.Value = val;
    },
    // SetVisible(bol) {
    //     this.isVisible = bol
    // },
    // 处理必填红色*号
    Validate() {
      const check = true;
      return check;
    },
    // 返回数据值
    SaveDataField() {
      const result = {};
      if (this.GetValue()) {
        result[this.formVal.dataField] = this.GetValue();
      } else {
        result[this.formVal.dataField] = this.GetValue();
      }
      return result;
    },
    getMatrixValue() {
      const val = {};
      val.showVal = this.value ? '是' : '否';
      val.submitVal = this.GetValue();
      return val;
    },
    changeVal(val) {
      this.SetValue(val);
    },
    onClick() {
      this.$store.state.isHtmlChangedBol = true;
    },
  },
  computed: {
    readOnlyVal() {
      return this.value ? '是' : '否';
    },
  },
  watch: {
    value() {
      if (this.isInGrid) {
        this.$store.state.isGridOnChange += 1;
        this.$store.state.gridChoosedDom = this;
      }
    },
  },
};
</script>

<style lang="less">
@import '../../../assets/css/form-base.less';
#form-check-box {
  background-color: white;
  position: relative;
  .controlLayout;
  .value-show {
    position: absolute;
    // left: 3.11rem;
    .px2rem(left,234);
    top: 50%;
    transform: translateY(-50%);
    color: @font-color0;
  }
  .weui-cells {
    // margin-left: .24rem;
    .px2rem(margin-left,24);
    &:before {
      height: 0;
      border-top: 0;
    }
    &:after {
      height: 0;
      border-bottom: none;
    }
    .weui-cell {
      padding: 0;
      .weui-cell__bd {
        font-size: inherit;
        .perWidth(width, 238);
        color: @font-color6;
        flex: inherit;
        // padding:.28rem 0;
        .px2rem(padding-top,28);
        .px2rem(padding-bottom,28);
        label {
          font-size: inherit;
        }
      }
      .weui-cell__ft {
        .perWidth(width, 488);
        .weui-switch:checked,
        .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
          border-color: @font-color-blue;
          background-color: @font-color-blue;
        }
        input {
          .px2rem(width,84);
          .px2rem(height,50);
          &:before {
            .px2rem(width,42);
            .px2rem(height,50);
            background-color: transparent;
          }
          &:after {
            .px2rem(width,42);
            .px2rem(height,44);
          }
        }
      }
    }
  }
  .has-border {
    border-bottom: 1px solid #ebebeb;
  }
}
</style>
