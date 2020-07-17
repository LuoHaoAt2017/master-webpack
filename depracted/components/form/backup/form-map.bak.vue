<template>
<!--  :class='{"animated pulse":errorBol}' -->
  <div id="form-map" v-show="isVisible">
    <div class="content bd-bot">
      <div class="left">
        <p class="dp-font30">{{formVal.DisplayName}}<span class="require" v-if="formVal.Required&&formVal.Editable">*</span>
        </p>
      </div>
      <div class="right" @click='goToMapPage'>
        <textarea class="dp-font30" rows='1' readonly :class="[errorBol?'error':'']" type="text" v-model="Address" :placeholder="placeholder"></textarea>
      </div>
      <div class="icon-dizhi" @click='goToMapPage' v-if="formVal.Editable"></div>
    </div>
    <div class="error-wrap" @click="hideErrorWrap" v-if='errorBol'></div>
    <!-- <input type="text" class="cover" readonly v-if="!formVal.Editable"> -->
    <input type="hidden" :title="value">
  </div>
</template>

<script>
import mixin from '../../../mixins/base-controler';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { getLocation, searchMapLocation, locateMapLocation } from '../../../config/dingtalk-interface';
import { isDingtalk } from '../../../config/common';

export default {
  name: 'FormMap',
  // 从父组件传递过来的数据
  props: ['formVal', 'keyName'],
  data() {
    return {
      Address: '',
      Point: { lat: 0, lng: 0 },
      placeholder: '请确定位置',
      errorBol: false,
      isInputBindEvent: false,
      isSetValueBol: false,
      value: {},
      isVisible: true,
    };
  },
  mixins: [mixin],
  created() {
    this.initPlaceholder();
  },
  mounted() {
    const that = this;
    this.$nextTick(() => {
      that.InitValue(that.formVal.Value);
      // 定位控件每次都需要自动获取当前位置
      if (isDingtalk && !that.$store.state.isExternalForm &&
      that.$store.state.formData.responseContext.IsCreateMode) {
        H3PluginDeveloper.ILocation(true, that.setAutoLatitude);
      }
    });
  },
  methods: {
    initPlaceholder() {
      // 显示地区模式
      if (this.formVal.Editable) {
        if (this.formVal.Required) {
          this.placeholder = '请确定位置(必填)';
        }
      } else {
        this.placeholder = '';
      }
    },
    goToMapPage() {
      if (!this.formVal.Editable) return;
      this.$store.state.isHtmlChangedBol = true;
      const that = this;
      getLocation((data) => {
        that.getLocationByDing(data);
      }, false);
    },
    getLocationByDing(result) {
      if (this.formVal.range === '0') {
        searchMapLocation(this.setLatitude, result.latitude, result.longitude);
      } else {
        locateMapLocation(this.setLatitude, result.latitude, result.longitude);
      }
    },
    // 设置手动定位的值
    setLatitude(result) {
      const poidata = {
        Address: result.province + result.city + result.adName + result.snippet + result.title,
        Point: {
          lat: result.latitude,
          lng: result.longitude,
        },
      };
      this.SetValue(poidata);
    },
    // 设置自动定位的值
    setAutoLatitude(result) {
      const poidata = {
        Address: result.address,
        Point: {
          lat: result.lat,
          lng: result.lng,
        },
      };
      this.SetValue(poidata);
    },
    SetValue(v) {
      let val = v;
      this.isSetValueBol = true;
      if (val != null) {
        if (Object.prototype.toString.call(val).indexOf('String') > -1) {
          val = JSON.parse(val);
        }
        this.Address = val.Address;
        this.Point = val.Point;
        this.value = val;
        this.formVal.Value = val;
      }
      this.OnChange();
    },
    InitValue(v) {
      let val = v;
      this.isSetValueBol = true;
      if (val != null) {
        if (Object.prototype.toString.call(val).indexOf('String') > -1) {
          val = JSON.parse(val);
        }
        this.Address = val.Address;
        this.Point = val.Point;
        this.value = val;
        this.formVal.Value = val;
      }
    },
    GetValue() {
      const pointData = {
        Address: this.Address,
        Point: this.Point,
      };
      return JSON.stringify(pointData);
    },
    AddInvalidText() {
      const self = this;
      this.errorBol = true;
      setTimeout(() => {
        self.errorBol = false;
      }, 1000);
    },
    Validate() {
      const val = this.GetValue();
      const address = $.parseJSON(val).Address;

      if (this.formVal.Required && (!address || address.trim() === '')) {
        this.AddInvalidText();
        return false;
      }
      return true;
    },
    // 返回数据值
    SaveDataField() {
      const result = {};
      result[this.keyName] = this.GetValue();
      return result;
    },
    getMatrixValue() {
      const val = {};
      val.showVal = this.Address;
      val.submitVal = this.GetValue();
      return val;
    },
  },
  computed: {},
  watch: {
    // isVisible(val){
    //     if(!val&&this.formVal.Editable){
    //     this.SetValue(null);
    //     }
    // },
    Address() {
      this.$nextTick(function a() {
        $(this.$el)
          .find('textarea')
          .each(function b() {
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
#form-map {
  position: relative;
  background-color: white;
  .controlLayout;
  .content {
    .right {
      .px2rem(padding-left,1);
      .px2rem(margin-top,3);
      .px2rem(margin-bottom,-3);
      textarea {
        width: 86%;
      }
    }
    .icon-dizhi {
      color: @font-color9;
      .px2rem(font-size,44);
      position: absolute;
      .px2rem(right,24);
      // .px2rem(top,28);
    }
  }
}
</style>
