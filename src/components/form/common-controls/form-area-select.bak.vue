<template>
  <ControlWrapper
    class="form-area-select"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <h3-area-selector
      ref="areaSelector"
      v-model="currentValue"
      :class="wrapCls"
      :title="options.DisplayName"
      :show="pickerShow"
      valueTextAlign="left"
      :list="addressData"
      :rawValue="true"
      :placeholder="placeholder"
      :inlineDesc="inlineDesc"
      :required="options.Editable && options.Required"
      :readonly="!options.Editable"
      :areaValue="areaValue"
      :mode="options.areamode"
      :displayFormat="displayFormat"
      :layout="controlLayout"
      @on-hide="onHide"
      @on-show="onShow"
      @on-shadow-change="onShadowChange"
      @onOk="onOk"
    >
      <div v-if="options.Editable && options.showdetailaddr" slot="contentFoot" class="detail-address">
        <div class="h3-field-line"></div>
        <textarea
          v-model="value.Detail"
          class="textarea-prevent"
          :class="textareaCls"
          rows="1"
          placeholder="请输入详细地址"
          @click.stop="clickDetail"
          @input="setAutoHeight"
        > </textarea>
        <div slot="extra" class="icon-wapper" @click="goToMapPage">
          <div class="h3-field-line"></div>
          <span class="icon h3yun_All get-address-o"></span>
        </div>
      </div>
    </h3-area-selector>
  </ControlWrapper>
</template>

<script lang="ts">
import { H3AreaSelector, H3Field } from 'h3-mobile-vue';
import { Component, Watch, Mixins } from 'vue-property-decorator';
import baseControler from '../mixins/base-controler';
import AreaData from '@/store/area-data.json';
import {
  getLocation,
  searchMapLocation,
  locateMapLocation,
} from '../../../config/dingtalk-interface';
import FormTextAreaOptions from '@/lib/form-logic/types/form-text-area.opts';
import ControlWrapper from '../shared/control-wrapper.vue';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { isiOS } from '@/config/common';

interface selectData {
  val: string;
  code: string[];
}

const adnameName: string = 'adname';
const DetailName: string = 'Detail';

@Component({
  components: {
    H3AreaSelector,
    H3Field,
    ControlWrapper,
  },
})
export default class FormAreaSelect extends Mixins(baseControler) {
  addressData: any[] = []; // 自定义的地址数据

  placeholder: string = '请选择';

  inlineDesc: string = ''; // 暂时没用

  isMapPageShow: boolean = false;

  ObjectId: string = '';

  pickerShow: boolean = false;

  options!: FormTextAreaOptions;

  get areaValue (): string {
    if (!this.value) {
      return '';
    }
    const v = this.value;
    const adname = v[adnameName] ? v[adnameName] : '';
    const detail = v[DetailName] ? v[DetailName] : '';
    return `${adname} ${detail}`;
  }

  get currentValue () {
    if (!this.value) {
      return [];
    }
    const v = this.value;
    const adname = v[adnameName] ? v[adnameName] : '';
    if (!adname) {
      return [];
    }
    return adname.split(/\s/).filter(c => !!c);
  }

  set currentValue (content) {
    if (!!content && content.length < 1) {
      this.value.adcode = '';
      this.value.adname = '';
    }
  }

  get wrapCls () {
    return {
      'h3-field-line': this.options.Editable && this.options.showdetailaddr,
    };
  }

  get textareaCls () {
    return {
      'h3-field-placeholder': !this.value.Detail,
    };
  }

  @Watch('value.Detail')
  detailChanged (val) {
    this.clearValid();
    this.setAutoHeight();
    this.$updateValue();
  }

  @Watch('visible')
  visibleChanged (val) {
    if (val) {
      this.setAutoHeight();
    }
  }

  created () {
    if (this.isIngrid) {
      this.ObjectId = this.namespace.split('/')[2];
    }
    if (this.addressData.length === 0) {
      this.addressData = AreaData;
    }
  }

  clickDetail () {
    this.clearValid();
  }

  onShadowChange () {}

  goToMapPage () {
    this.clearValid();
    if (this.isMapPageShow) {
      return;
    }
    this.isMapPageShow = true;
    getLocation((data) => {
      this.isMapPageShow = false;
      this.getLocationByDing(data);
    }, false, (err) => {
      if (isiOS && err.errorCode === '4') {
        H3PluginDeveloper.IShowWarn('定位权限未开启，请开启权限后重试');
      }
    });
  }

  getLocationByDing (result) {
    if (this.options.Range === '0') {
      searchMapLocation(this.setLatitude, result.latitude, result.longitude);
    } else {
      locateMapLocation(this.setLatitude, result.latitude, result.longitude);
    }
  }

  setLatitude (result) {
    const val: any = {};
    val.adcode = result.adCode;
    let adName = '';
    if (this.options.areamode === 'P') {
      adName = result.province;
    } else if (this.options.areamode === 'P-C') {
      adName = `${result.province} ${result.city}`;
    } else {
      adName = `${result.province} ${result.city} ${result.adName}`;
    }
    val.adname = adName;
    if (this.options.showdetailaddr) {
      val.Detail = result.snippet + result.title;
    } else {
      val.Detail = '';
    }
    this.value = val;
  }

  setAutoHeight () {
    this.$nextTick(() => {
      const textarea = this.$el.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight < 24 ? 24 : textarea.scrollHeight}px`;
      }
    });
  }

  displayFormat (val, names) {
    return names.replace(/,/g, ' ');
  }

  onOk (content: selectData) {
    const { val, code } = content;
    this.value.adcode = code[code.length - 1] || code[code.length - 2] || code[0];
    this.value.adname = val.split(',').join(' ');
    this.$updateValue();
  }

  onShow () {
    this.clearValid();
    this.pickerShow = true;
    this.backStack.push(() => {
      this.pickerShow = false;
    });
  }

  onHide () {
    this.backStack.pop();
  }
}

</script>
<style lang="less">
  .form-area-select{
    word-break: break-all;
    word-wrap: break-word;
    >.h3-field-line{
      .h3-popup-picker-select, .h3-field-placeholder{
        padding-bottom: 10px;
      }
    }
    .h3-field-box .h3-PR{
      padding-bottom: 0;
    }
    .detail-address{
      position: relative;
      min-height: 45px;
      .h3-field-placeholder{
        padding-bottom: 0;
      }
      textarea {
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100%;
        line-height: 25px;
        vertical-align: middle;
        font-size: 15px;
        color: inherit;
        &::-webkit-input-placeholder {
          line-height: 25px;
        }
        &::-ms-input-placeholder {
          line-height: 25px;
        }
        &::placeholder {
          line-height: 25px;
        }
      }

    }
    .icon-wapper{
      position: absolute;
      right: -23px;
      top: 0px;
      width: 23px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      .get-address-o {
        font-size: 16px;
      }
    }
  }
</style>
