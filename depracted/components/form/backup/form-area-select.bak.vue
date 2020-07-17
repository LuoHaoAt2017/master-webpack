<template>
<!--  :class='{"animated pulse":errorBol}' -->
  <div id="form-area-select" v-show="isVisible">
         <Group v-if='formVal.Editable'>
          <form-address class="dp-font30" :ObjectId='ObjectId' :keyName='keyName' :title="title" :popup-title='popupTitle' v-model="currentVal" :show='$store.state.AreaCotrolPopObj.bol&&$store.state.AreaCotrolPopObj.ObjectId==ObjectId&&$store.state.AreaCotrolPopObj.keyName==keyName' :list="addressData" :placeholder="placeholder" :hide-district="hideDistrict" :hide-city="hideCity" @getAddressName="getAddressName" @clearAddressVal='clearAddressVal' @on-hide='popAddressHide' @on-show='popAddressShow'>
            <template slot="title" slot-scope="props">
              <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
                  <span class="dp-font30" style="vertical-align:middle;">{{formVal.DisplayName}}
                      <span class="require" v-if="formVal.Required&&formVal.Editable">*</span>
                  </span>
              </span>
            </template>
          </form-address>
          <span class="icon-next2"></span>
        </Group>
        <div class="content" v-if="!formVal.Editable" :class="[isInGrid?'no-border':'bd-bot']">
          <div class="left">
            <p class="dp-font30">{{formVal.DisplayName}}<span class="require" v-if="formVal.Required&&formVal.Editable">*</span></p>
          </div>
          <div class="right">
            <textarea class="dp-font30" rows='1' v-if="formVal.Editable" type="text" v-model="readOnlyVal"></textarea>
            <div class="text dp-font30" v-if="!formVal.Editable">{{readOnlyVal}}</div>
          </div>
        </div>
        <div class="detailAdd" v-if="showdetailaddr&&formVal.Editable" :class="[isInGrid?'detailAdd-no-border':'bd-bot']">
          <div class="left">
            <p class="dp-font30"></p>
          </div>
          <div class="detail-wrap right">
            <textarea class="dp-font30" rows="1" type="text" :class="[errorBol?'error':'']" placeholder="请输入详细地址" @change='getDetailVal' v-model="detailVal"></textarea>
          </div>
        <span class="icon-dizhi" @click='goToMapPage'></span>
        </div>
        <div class="error-wrap" @click="hideErrorWrap" v-if='errorBol'></div>
        <!-- <input type="text" class="cover" readonly v-if="!formVal.Editable"> -->
        <input type="hidden" :title="value">
    </div>
</template>

<script>
import { Group } from 'vux';
import FormAddress from './form-address.vue';
import mixin from '../../../mixins/base-controler';
import AreaData from '../../../store/area-data.json';
import { getLocation, searchMapLocation, locateMapLocation } from '../../../config/dingtalk-interface';

export default {
  name: 'FormAreaSelect',
  components: {
    FormAddress,
    Group,
  },
  props: ['formVal', 'keyName', 'ObjectId'],
  data() {
    return {
      title: '默认为空',
      // addressData: ChinaAddressV3Data, // 地址数据列表
      addressData: [], // 自定义的地址数据
      hideDistrict: false, // 是否隐藏区
      hideCity: false, // 是否隐藏xian
      showdetailaddr: '', // 是否需要输入具体地址
      detailVal: '', // 具体地址
      placeholder: '请选择地区',
      currentVal: [], // 显示的值
      adcodeName: 'adcode',
      adnameName: 'adname',
      DetailName: 'Detail',
      isInGrid: false,
      gridDataField: '',
      readOnlyVal: '',
      filterObj: {},
      popupTitle: '清空',
      errorBol: false,
      fullName: '',
      isInputBindEvent: false,
      isSetValueBol: false,
      value: '',
      isVisible: true,
      isMapPageShow: false,
      specialRegion : ["810000", "820000"]
    };
  },
  // baseControler的方法混入
  mixins: [mixin],
  created() {
    if (!this.formVal.Editable && this.formVal.Editable !== false) {
      this.formVal.Editable = true;
    }
    // 判断控件是否在子表内
    if (this.keyName) {
      if (this.keyName.indexOf('.') > 1) {
        this.isInGrid = true;
        this.gridDataField = this.keyName.split('.')[0];
      }
    }
    this.initPlaceholder();
  },
  mounted() {
    if (this.isInGrid) {
      $(this.$el).find('.vux-cell-primary').css('background-image', 'none');
    }
    this.$nextTick(() => {
      $(this.$el).find('textarea').each(function a() {
        this.style.height = 'auto';
        this.style.height = `${this.scrollHeight}px`;
      }).on('input', function b() {
        this.style.height = 'auto';
        this.style.height = `${this.scrollHeight}px`;
      });
      this.InitValue(this.formVal.Value);
    });
  },
  methods: {
    initPlaceholder() {
      // 是否显示详细地址
      this.showdetailaddr = eval(this.formVal.showdetailaddr);
      // 显示地区模式
      this.areamode();
      if (this.formVal.Editable) {
        if (this.formVal.Required) {
          this.placeholder = '请选择地区(必填)';
        }
      } else {
        this.placeholder = '';
      }
    },
    // 获取详细地址
    getDetailVal(e) {
      this.$store.state.isHtmlChangedBol = true;
      if (this.value) {
        this.value.Detail = e.target.value;
      } else {
        this.value = {adcode: '', adname: '', Detail: e.target.value};
      }
      this.OnChange();
    },
    GetValue() {
      if (this.value == null) {
        return '';
      }
      if (this.value.constructor === String) {
        return this.value;
      }
      return JSON.stringify(this.value);
    },
    ClearValue() {
      this.currentVal = [];
      this.value = '';
    },
    SetValue(v) {
      this.AddValue(v);
      this.OnChange();
    },
    InitValue(v) {
      this.AddValue(v);
    },
    AddValue(val) {
      let v = val;
      this.isSetValueBol = true;
      const that = this;
      if (v == null || !v) {
        that.ClearValue();
        return;
      } else if (typeof v === 'object') {
        if (!v.adcode) {
          this.value = '';
          this.formVal.Value = '';
          return;
        } else if (this.currentVal.length || !v.adcode) {
          // this.value = v;
          return;
        }
        v = JSON.stringify(v);
      } else if (v.trim() === '') {
        that.ClearValue();
        return;
      }
      if (that.IsJsonString(v)) {
        v = v.replace(/[\r\n]/g, ''); // 去掉换行
        v = JSON.parse(v);
        that.value = v;
        that.formVal.Value = v;
        if (v.Detail) {
          if (v[that.adcodeName] && v[that.adcodeName].trim() === '' && v.Detail.trim() === '') {
            that.ClearValue();
            return;
          }
        } else if (v[that.adcodeName]) {
          if (v[that.adcodeName].trim() === '') {
            that.ClearValue();
            return;
          }
        } else {
          that.ClearValue();
          return;
        }
      }
      const adcode = v[that.adcodeName];
      if (adcode === undefined) {
        return;
      }
      const adname = v[that.adnameName];
      const detail = v[that.DetailName];
      this.readOnlyVal = `${adname} ${detail}`;
      const citykey = adcode.substring(2, 4);
      const townkey = adcode.substring(4, 6);
      let provinceValue = '';
      let citykeyValue = '';
      let townkeyValue = '';
      provinceValue = `${adcode.substring(0, 2)}0000`;
      if (townkey === '00') {
        if (citykey !== '00') {
          citykeyValue = `${adcode.substring(0, 4)}00`;
        }
      } else if (citykey === '00') {
        townkeyValue = adcode;        
        
        //针对港澳行政区
        if (provinceValue && $.inArray(provinceValue, this.specialRegion) > -1) {
            citykeyValue = adcode;
            townkeyValue = "";
        }

      } else {
        citykeyValue = `${adcode.substring(0, 4)}00`;
        townkeyValue = adcode;
      }

      const adVal = [];

      if (that.formVal.areamode === 'P-C') {
        adVal.push(provinceValue);
        adVal.push(citykeyValue);
      } else if (that.formVal.areamode === 'P') {
        adVal.push(provinceValue);
      } else {
        adVal.push(provinceValue);
        adVal.push(citykeyValue);
        adVal.push(townkeyValue);
      }
      if (!this.addressData.length) {
        this.addressData = AreaData;
      }
      that.currentVal = adVal;
      if (detail) {
        that.showdetailaddr = true;
        that.detailVal = detail;
      }
    },
    IsJsonString(str) {
      const JSON_START = /^\[|^\{(?!\{)/;
      const JSON_ENDS = {
        '[': /]$/,
        '{': /}$/,
      };
      const jsonStart = str.match(JSON_START);
      return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
    },
    // SetVisible(bol) {
    //   this.isVisible = bol;
    // },
    // 校验
    Validate() {
      if (this.formVal.Required && (!this.value
        || (this.value && !this.value.adname && !this.value.adcode && !this.value.Detail))) {
        const $placeholder = $(this.$el).find('.vux-cell-placeholder')[0];
        if ($placeholder) {
          $placeholder.style.color = '#E64340';
          this.errorBol = true;
          const self = this;
          setTimeout(() => {
            self.errorBol = false;
            $placeholder.style.color = '#999999';
          }, 1000);
        }
        return false;
      }
      return true;
    },
    // 判断区域选择模式
    areamode() {
      switch (this.formVal.areamode) {
        case 'P-C-T':
          this.hideDistrict = false;
          this.hideCity = false;
          break;
        case 'P-C':
          this.hideDistrict = true;
          this.hideCity = false;
          break;
        case 'P':
          this.hideDistrict = true;
          this.hideCity = true;
          break;
        default:
          break;
      }
    },
    clearAddressVal(obj) {
      if (obj.ObjectId === this.ObjectId && obj.keyName === this.keyName) {
        this.value = '';
        this.formVal.Value = '';
        this.currentVal = [];
        this.detailVal = '';
        this.popAddressHide();
        this.OnChange();
      }
    },
    getAddressName(v) {
      let val = v;
      this.fullName = val;
      const valObj = {};
      val = val.split(' ');
      let tempCode = this.currentVal[this.currentVal.length - 1];
      if (this.currentVal.length > 2 && !tempCode) {
        tempCode = this.currentVal[this.currentVal.length - 2];
      }
      if (this.currentVal.length > 2 && !tempCode) {
        tempCode = this.currentVal[this.currentVal.length - 3];
      }
      valObj.adcode = tempCode || '';
      valObj.adname = val.join(' ');
      valObj.Detail = this.detailVal;
      if (!valObj.adcode && !valObj.adname && !valObj.Detail) {
        this.value = '';
        this.formVal.Value = '';
      } else {
        this.value = valObj;
        this.formVal.Value = valObj;
      }
      const tempArr = [];
      tempArr.push(JSON.stringify(valObj));
      this.filterObj[this.formVal.PropertyName] = tempArr;
      this.$root.eventHub.$on('send-subs-val', this.filterObj);
      this.OnChange();
    },
    // 返回数据值
    SaveDataField() {
      const result = {};
      // if (!this.formVal.Visible&&!this.formVal.Editable) return result;
      let val = this.GetValue();
      if (val === 'null') {
        val = '';
      }
      result[this.formVal.dataField] = val;
      return result;
    },
    goToMapPage() {
      if (this.isMapPageShow) {
        return;
      }
      this.isMapPageShow = true;
      this.$store.state.isHtmlChangedBol = true;
      const that = this;
      getLocation((data) => {
        that.isMapPageShow = false;
        that.getLocationByDing(data);
      }, false);
    },
    getLocationByDing(result) {
      if (this.formVal.Range === '0') {
        searchMapLocation(this.setLatitude, result.latitude, result.longitude);
      } else {
        locateMapLocation(this.setLatitude, result.latitude, result.longitude);
      }
    },
    setLatitude(result) {
      const val = {};
      val.adcode = result.adCode;
      val.adname = result.adName;
      val.Detail = result.snippet + result.title;
      this.SetValue(JSON.stringify(val));
    },
    popAddressHide() {
      this.$store.state.AreaCotrolPopObj.bol = false;
      this.$store.state.AreaCotrolPopObj.keyName = this.keyName;
      this.$store.state.AreaCotrolPopObj.ObjectId = this.ObjectId;
    },
    popAddressShow() {
      this.$store.state.isHtmlChangedBol = true;
      if (!this.addressData.length) {
        this.addressData = AreaData;
      }
      this.$store.state.AreaCotrolPopObj.bol = true;
      this.$store.state.AreaCotrolPopObj.keyName = this.keyName;
      this.$store.state.AreaCotrolPopObj.ObjectId = this.ObjectId;
    },
    getMatrixValue() {
      const val = {};
      val.showVal = this.fullName + this.detailVal;
      val.submitVal = this.GetValue();
      return val;
    },
  },
  computed: {},
  watch: {
    value() {
      if (this.isInGrid) {
        this.$store.state.isGridOnChange += 1;
        this.$store.state.gridChoosedDom = this;
      }
      this.$nextTick(() => {
        $(this.$el).find('textarea').each(function c() {
          this.style.height = 'auto';
          this.style.height = `${this.scrollHeight}px`;
        });
      });
    },
  },
};
</script>

<style lang="less">
@import '../../../assets/css/form-base.less';

#form-area-select {
  background-color: white;
  .controlLayout;
  .weui-cells {
    // margin-left: 0.24rem;
    .px2rem(margin-left,24);
    &:before {
      height: 0;
      border-top: 0;
    }
    &:after {
      height: 0 !important;
      border: none !important;
    }
    .icon-next2 {
      position: absolute;
      .px2rem(right,25);
      top: 50%;
      transform: translateY(-50%);
      color: @font-color9;
    }
    .vux-cell-box {
      &:before {
        height: 0;
        border: none;
      }
      .weui-cell {
        padding: 0;
        font-size: inherit;
        align-items: unset;
        .weui-cell__hd {
          font-size: inherit;
          .perWidth(width, 238);
          color: @font-color6;
          .weui-label {
            height: auto !important;
            .px2rem(padding-top,24);
            display: inline-block !important;
            span {
              display: inline-block;
            }
          }
        }
        .vux-cell-primary {
          font-size: inherit;
          .perWidth(width, 488);
          &:after {
            height: 0;
            border: none;
          }
          // border-bottom: 1px solid #ebebeb;
          border: 0 !important;
          background-image: -webkit-linear-gradient(0deg, #e4e4e4, #e4e4e4 33.333333%, transparent 33.333333%);
          background-image: linear-gradient(0deg, #e4e4e4, #e4e4e4 33.333333%, transparent 33.333333%);
          background-size: 100% 1px;
          background-repeat: no-repeat;
          background-position: bottom;
          .px2rem(padding-top,28);
          .px2rem(padding-bottom,28);
          .vux-popup-picker-select {
            text-align: left !important;
            font-size: inherit;
            span {
              font-size: inherit;
            }
            .vux-popup-picker-placeholder {
              color: @font-color9;
            }
            .vux-popup-picker-value {
              color: @font-color0;
            }
          }
        }
        .weui-cell__ft {
          display: none;
        }
      }
    }
  }
  .detailAdd {
    text-align: right;
    position: relative;
    display: flex;
    height: auto;
    .px2rem(margin-left,24);
    // border-bottom: 1px solid #E4E4E4;
    .px2rem(padding-top,12);
    .px2rem(padding-bottom,12);
    .left {
      .perWidth(width, 238);
      color: @font-color6;
      p {
        .px2rem(width,196);
        .px2rem(height,74);
      }
    }
    .right {
      .perWidth(width, 440);
      position: relative;
      .px2rem(padding-right,48);
      .px2rem(padding-left,1);
      .px2rem(margin-left,-6);
      .px2rem(margin-top,3);
      .px2rem(margin-bottom,-3);
      textarea {
        width: 100%;
        color: @font-color0;
        vertical-align: middle;
        padding: 0;
        .px2rem(line-height,42);
        .px2rem(margin-top,15);
        .px2rem(height,42);
        .px2rem(margin-bottom,15);
        // .px2rem(text-indent, 3)!important;
      }
      textarea::-webkit-input-placeholder {
        /* WebKit browsers */
        .px2rem(text-indent, 3) !important;
      }
      textarea::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        .px2rem(text-indent, 3) !important;
      }
      textarea:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        .px2rem(text-indent, 3) !important;
      }
    }
    .detail-wrap {
      textarea {
        .px2rem(min-height,42);
      }
    }
  }
  .detailAdd-no-border {
    border: none;
  }
}
.vux-popup-picker-placeholder .vux-cell-placeholder {
  font-size: 14px;
  margin-left: 16%;
}
.icon-dizhi {
  .px2rem(font-size,44);
  .px2rem(right,24);
  .px2rem(line-height,100);
  bottom: 0;
  top: 0;
  .px2rem(width,50);
  text-align: right;
  position: absolute;
  color: @font-color9;
}
.vux-popup-dialog {
  z-index: 100001 !important;
  .vux-popup-picker-container {
    .vux-popup-header {
      background-color: white; // height: .98rem;
      .px2rem(height,98);
      div {
        color: @font-color-blue;
        font-size: inherit;
      }
      .vux-popup-header-title {
        text-align: right; // padding-right: .3rem;
        .px2rem(padding-right,30);
      }
    }
    .vux-picker {
      background-color: white;
    }
  }
}
</style>
