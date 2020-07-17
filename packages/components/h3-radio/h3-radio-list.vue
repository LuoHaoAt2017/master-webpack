<template>
 <div>
  <!-- 平铺模式 -->
  <div
    :class= "radioListCls"
    v-if="showMode==='1'">
    <h3-field :tip="tip"
      :errMsg="geterrMsg" 
      :label="title" 
      :showIcon="false"
      activeCls="h3-radio-field"
      :required="required"
      :readOnly="!editable">
        <div v-if="editable && !readonly" class="radio-item-wrapper-plain">
          <div  class="radio-item-wrapper" :class="itemsWrapperCls" @scroll="itemsWrapperScroll">
            <h3-radio-item v-for="(item, index) in getOptions" :value="item.value" :key="'item_'+index" :returnValue="selected" @onChange="radioChange" >
              <span>{{item.label}}</span>
            </h3-radio-item>
          </div>
        </div>
        <div class="h3-radio-selected-wraper" v-text="selected" v-else/>
    </h3-field>
  </div>

  <!-- 上滑模式 -->
  <div>
    <div class="h3-field-tip" v-if="showTip">
      <div class="h3-field-tip-wrapper">
        <div v-html="tip" ></div>
      </div>
      <div class="h3-field-tip-arrow" ></div>
    </div>

    <div
      :class= "radioListCls"
      v-if="showMode==='0'" v-touch="{}">
      <popup-picker valueTextAlign="left" tip="tip" :title="title1" :data="pickerOptions" v-model="value1_1" @on-show="onShow" @on-hide="onHide" @on-change="onPickerChange" placeholder="请选择" v-if="!readonly || editable" @onToggleTip="toggleTip"></popup-picker>
      <template v-if="!editable || readonly">
        <h3-radio-item v-for="(item, index) in getOptions" :value="item.value" :key="'item_'+index" :returnValue="selected" @onChange="radioChange" >
          <span>{{item.label}}</span>
        </h3-radio-item>
      </template>
      <div v-if="required" style="display:inline-block;line-height:0;position: absolute;left: 7px;top: 15px;" class=" h3-svg h3-field-layout-label-required" >
        <svg width="8" height="8" fill="red" name="" viewBox="0 0 200 200" >
          <path d="M141.362 86.037L104.838 100l36.512 13.963c9.3 3.587 14.675 6.45 16.113 8.6 1.425 2.15 2.15 4.3 2.15 6.45 0 5.737-1.088 8.962-3.263 9.662a20.358 20.358 0 0 1-6.5 1.075c-2.187 0-4.35-.538-6.512-1.613-2.175-1.075-4.7-2.687-7.588-4.837l-33.587-30.075 7.6 45.112c.712 2.15 1.075 4.125 1.075 5.913v3.762c0 4.3-1.075 7.35-3.25 9.125-2.175 1.8-4.7 2.688-7.588 2.688-2.212 0-4.6-.713-7.187-2.15-2.588-1.425-3.863-4.65-3.863-9.663 0-1.425.188-2.862.55-4.3.375-1.425.55-3.225.55-5.375l8.825-45.112L64.65 133.3a121.392 121.392 0 0 1-7.187 4.3c-2.588 1.437-4.963 2.15-7.163 2.15-2.212 0-4.412-.713-6.625-2.15-2.212-1.425-3.312-4.3-3.312-8.6 0-2.863 1.075-5.375 3.225-7.525s7.15-4.65 15.037-7.525L95.175 100 58.65 86.037c-5.012-2.15-9.312-4.112-12.887-5.912-3.588-1.788-5.375-4.838-5.375-9.125 0-3.575 1.075-6.263 3.237-8.063 2.175-1.775 4.325-2.687 6.513-2.687 2.162 0 4.512.537 7.05 1.612 2.512 1.075 4.862 2.688 7.05 4.838l33.6 30.075-7.588-45.113c0-2.15-.187-3.925-.55-5.375a16.822 16.822 0 0 1-.537-4.3c0-2.862 1.075-5.537 3.25-8.062 2.175-2.488 4.712-3.75 7.587-3.75 4.425 0 7.338 1.437 8.838 4.3 1.462 2.862 2.212 5.375 2.212 7.525v4.837c0 1.8-.375 3.4-1.112 4.838l-8.825 45.1L135.325 66.7c2.938-2.863 5.5-4.65 7.725-5.375 2.213-.713 4.413-1.075 6.625-1.075 2.938 0 5.325 1.075 7.163 3.225s2.787 4.662 2.787 7.525c0 2.862-.725 5.2-2.15 6.987-1.45 1.788-6.812 4.475-16.112 8.05z" >
          </path>
        </svg>
      </div>
    </div>
  </div>
  
 </div>
  
</template>
<script>
import cx from 'classnames';
import h3List from '../h3-list/h3-list';
import h3ListItem from '../h3-list/h3-list-item';
import h3Modal from '../h3-modal/index';
import h3RadioItem from '../h3-radio/h3-radio-item';
import { H3Field, H3Label } from 'h3-mobile-vue';
import PopupPicker from '../h3-popup-picker';
import touch from '../../directives/touch';

const prefixCls = 'h3-radio-list';
export default {
  name: 'h3-radio-list',
  components: {
    h3List,
    h3ListItem,
    h3Modal,
    h3RadioItem,
    H3Field,
    H3Label,
    PopupPicker,
  },
  directives: {
    touch,
  },
  props: {
    showMode: {
      type: String,
      validator(val) {
        if (val === '1' || val === '0') {
          // 1: 平铺显示 0: 上滑模式
          return true;
        }
        return false;
      },
    },
    options: Array,
    title: String,
    defaultValue: String,
    value: String,
    disabled: Boolean,
    required: Boolean,
    editable: {
      type: Boolean,
      default: true,
    },
    readonly: Boolean,
    onChange: Function,
    layout: {
      type: String,
      default: 'h',
      validator: val => ['h', 'v'].indexOf(val) > -1,
    },
    tip: {
      type: String,
      default: '这是一个测试的tip',
    },
    errMsg: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      popupModalShow: false,
      selected: this.value || this.defaultValue || '',
      title1: '上滑模式筛选',
      // pickerOptions: [['火车火车火车火车火车火车火车火车火车火车火车火车火车', '汽车', '飞机', 'bike']],
      value1_1: [],
      showTip: false,
      labelWidth: 102,
      itemsWrapperCls: '',
    };
  },
  created() {

  },
  mounted() {

  },
  updated() {

  },
  methods: {
    show() {
    },
    hide() {
    },
    hidePopupModal() {
      this.popupModalShow = false;
    },
    showPopupModal() {
      this.popupModalShow = true;
    },
    radioChange(val) {
      console.log('radiolist-change....', val);
      this.$emit('input', val);
      if (this.onChange) {
        this.onChange(val);
      }
      this.$emit('onChange', val);
    },
    radioClick(val) {
      console.log('radiolist-click....', val);
      this.hidePopupModal();
    },
    showErrorMsg() {
      window.toast.show({
        text: this.errMsg,
      });
    },
    onShow() {
      console.log('on show');
    },
    onHide(type) {
      console.log('on hide', type);
    },
    onPickerChange(val) {
      console.log('val change', val);
      this.$emit('onPickerChange', val);
    },
    toggleTip(isShowTip) {
      this.showTip = isShowTip;
      if (isShowTip) {
        // this.$nextTick(() => {
        //   this.$refs.scrollView.refresh();
        // });
      }
    },
    itemsWrapperScroll() {
      this.itemsWrapperCls = 'radio-item-wrapper-scroll';
    },
  },
  computed: {
    getOptions() {
      const ops = [];
      if (Array.isArray(this.options)) {
        this.options.forEach((value) => {
          const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]';
          if (isObject) {
            ops.push(value);
          } else {
            const newOption = {
              value,
              label: value,
            };
            ops.push(newOption);
          }
        });
      }
      return ops;
    },
    geterrMsg() {
      if (this.editable && !this.readonly) {
        return this.errMsg;
      }
      return '';
    },
    radioListCls() {
      return cx('h3-list', prefixCls, {
        [`${prefixCls}-${this.showMode}`]: true,
        [`${prefixCls}-view`]: this.readonly || !this.editable,
      });
    },
    pickerValue: {
      get() {
        return this.value1_1[0];
      },
      set(val) {
        return val;
      },
    },
    pickerOptions() {
      const arr = [];
      arr[0] = this.options;
      return arr;
    },
  },
  watch: {
    value(val) {
      this.selected = val;
    },
    value1_1(val) {
      this.value = val[0];
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@radioListPrefixCls: h3-radio-list;
@radioListPrefixCls0: h3-radio-list-0; //上滑模式
@radioListPrefixCls1: h3-radio-list-1; // 平铺模式
@listPrefixCls: h3-list;
@listLinePrefixCls: ~"@{listPrefixCls}-line";
@listContentPrefixCls: ~"@{listPrefixCls}-content";
@listExtraPrefixCls: ~"@{listPrefixCls}-extra";
@field-label-color: #333333;
@field-text-color: #333333;
@field-label-color-view: #999999;
.@{radioListPrefixCls}-view {
  .h3-field-layout-h-label {
    color: @field-label-color-view;
  }
}
.@{radioListPrefixCls} {
  background-color: #fff;
  .h3-list-body {
    &::after {
      left: 16px !important;
    }
  } 
  .h3-radio-selected-wraper {
    line-height: 24px;
    .px2rem(font-size, 34);
    .px2rem(line-height, 50);
    // padding-left: 16px;
  }
  .h3-list-item {
    .@{listLinePrefixCls}{
      .@{listContentPrefixCls} {
        .h3-field-layout-v-label {
          margin-left:0;
        }
      }
    }
  }
}
.@{radioListPrefixCls0} {
  position: relative;
  padding: 10px 0px 0px 15px;
  .h3-radio-item{
    .px2rem(min-height, 100);
    .h3-list-line{
      .hairline('bottom', #eee);
    }
    input{
      .px2rem(font-size, 34);
      .px2rem(line-height, 51);
    }
  }
  .h3-cell{
    padding: 0;
    font-size: 17px;
    line-height: 25px;
    align-items: flex-start;
  }
  .h3-cell-box {
    position: relative;
    padding-bottom: 10px;
    padding-right: 15px;
    .hairline('bottom', #eee);
    .h3-cell__hd {
      width: 122px;
      position: relative;
      display: flex;
      .h3-label {
        width: 102px;
        display: block;
      }
      .h3-field-label-tip {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    i {
      color: #999;
    }
    i.icon-base-right {
      position: absolute;
      top: 0;
      right: 0;
    }
    .h3-cell-primary {
      padding-left: 4px;
    }
  }
  .h3-cell_access:active {
    background: transparent;
  }
  .h3-popup-header {
    background: #fff;
  }
}

.@{radioListPrefixCls1} {
  .h3-FBAC {
    align-items: flex-start;
  }
  .h3-field-error-icon {
    margin-top:12px;
  }
  .h3-field-box {
    padding-right: 0 !important;
  }
  // .h3-field-layout-label-required {
  //   padding-top: 6px;
  //   position: absolute;
  //   left: 9px;
  // }
  
  // .h3-field-layout-h-label{
  //   padding-top: 10px;
  //   position: relative;
  //   padding: 11px 0;
  //   padding-right: 20px;
  //   width: 118px;
  //   line-height: 22px;
  //   font-size: 17px;
  //   padding-left: 15px;
  // }
  .h3-field-box .h3-PR {
    padding: 0;
    padding-left: 4px;
    font-size: 17px;
    line-height: 25px;
    .radio-item-wrapper {
      max-height: 270px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: block;
        background: transparent;
        width: 4px;
        height: 4px;
        position: absolute;
        right: -15px;
      }
      &::-webkit-scrollbar-thumb {
        display: block;
        background: #d8d8d8;
        width: 4px;
        height: 4px;
        border-radius: 4px;
      }
    }
    .radio-item-wrapper-scroll {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }
  .h3-field-icon{
    width: 52px;
    height: 45px;
    margin: 0;
    line-height: 0;
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(0);
    color: #C7C7CC;
  }
  .h3-field-icon-wrapper {
    width: 22px;
    height: 22px;
    position: absolute;
    top: 11px;
    right: 15px;
    i{
      position: absolute;
      top: 11px;
      left: 0;
    }
  }
  .h3-list-item {
    padding-left: 0;
  }
  .h3-list-item:not(:last-child){
    .hairline('bottom', #eee);
  }
  .h3-radio-selected-wraper {
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 17px;
    line-height: 25px;
  }
}

.h3-radio-header-cancel,
.h3-radio-header-clear {
  position: absolute;
  // top: 0;
  .px2rem(top, 32);
  .px2rem(font-size, 34);
  .px2rem(line-height, 36);
  padding-left: @popup-header-left-text-padding;
  // color: @popup-header-right-text-color;
  color: #1890ff;
}
.h3-radio-header-clear {
  // left: 47px;
  .px2rem(top, 32);
  .px2rem(font-size, 34);
  .px2rem(line-height, 36);
  .px2rem(left, 94);
}

.h3-radio-header-right {
  position: absolute;
  top: 0;
  right: 0;
  .px2rem(top, 32);
  .px2rem(font-size, 34);
  .px2rem(line-height, 36);
  padding-right: @popup-header-right-text-padding;
  color: @popup-header-right-text-color;
}
</style>

