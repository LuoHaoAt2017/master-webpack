<template>
  <ControlWrapper
    class="form-area-select"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <form-field
      :label="options.DisplayName"
      :readonly="!editable"
      :required="editable && options.Required"
      :layout="controlLayout"
      :tip="inlineDesc"
      :hasBorderBottom="false"
      @contentClick="onFieldClick"
    >
      <span v-if="editable" class="form-field__body" :class="{'form-field__placeholder': !value.adname}">
        {{ value.adname || '请选择' }}
      </span>
      <span v-else class="form-field__body">
        {{ readonlyValue }}
      </span>
      <div
        v-if="editable && options.showdetailaddr"
        slot="footer"
        class="address-detail"
        :class="{'address-detail--horizontal': controlLayout === 'h'}"
      >
        <div class="address-detail__horizon-divide"></div>
        <textarea
          v-model="value.Detail"
          class="textarea-prevent"
          :class="textareaCls"
          rows="1"
          placeholder="请输入详细地址"
          @click.stop="clickDetail"
          @input="setAutoHeight"
        > </textarea>
        <div class="icon-wapper" @click="goToMapPage">
          <span class="icon h3yun_All get-address-o"></span>
        </div>
      </div>
    </form-field>
    <h3-area-picker
      v-model="pickerShow"
      maskClosable
      :value="pickerValue"
      :source="addressData"
      :mode="options.areamode"
      @show="onShow"
      @hide="onHide"
      @select="onSelect"
    />
  </ControlWrapper>
</template>

<script lang="ts">
import { H3AreaPicker } from '@h3/thinking-ui';
import { Component, Watch, Mixins } from 'vue-property-decorator';
import baseControler from '../mixins/base-controler';
// import AreaData from '@/store/area-data.json';
import {
  getLocation,
  searchMapLocation,
  locateMapLocation,
} from '../../../config/dingtalk-interface';
import FormTextAreaOptions from '@/lib/form-logic/types/form-text-area.opts';
import ControlWrapper from '../shared/control-wrapper.vue';
import FormField from '../shared/form-field.vue';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { isiOS } from '@/config/common';
import requestPct from '@/utils/request-pct';

interface selectData {
  val: string;
  code: string[];
}

const adnameName: string = 'adname';
const DetailName: string = 'Detail';

@Component({
  components: {
    H3AreaPicker,
    ControlWrapper,
    FormField,
  },
})
export default class FormAreaSelect extends Mixins(baseControler) {
  addressData: any[] = []; // 自定义的地址数据

  areaFlatData: any = [];

  placeholder: string = '请选择';

  inlineDesc: string = ''; // 暂时没用

  isMapPageShow: boolean = false;

  ObjectId: string = '';

  pickerShow: boolean = false;

  options!: FormTextAreaOptions;

  get readonlyValue (): string {
    if (!this.value) {
      return '';
    }
    const v = this.value;
    const adname = v[adnameName] ? v[adnameName] : '';
    const detail = v[DetailName] ? v[DetailName] : '';
    return `${adname} ${detail}`;
  }

  get pickerValue (): any[] {
    if (this.value && this.value.adcode) {
      return this.getAreaValueById(this.value.adcode);
    }
    return [];
  }

  get wrapCls () {
    return {
      'h3-field-line': this.editable && this.options.showdetailaddr,
    };
  }

  get textareaCls () {
    return {
      'h3-field-placeholder': !this.value.Detail,
    };
  }

  @Watch('value.Detail')
  detailChanged () {
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
    // if (this.addressData.length === 0) {
    //   this.addressData = AreaData;
    // }
    requestPct().then(areaData => {
      const { treeData, flatData } = areaData;
      this.areaFlatData = flatData;
      this.addressData = treeData;
      console.log(this.areaFlatData);
    });
  }

  clickDetail () {
    this.clearValid();
  }

  flatArea (area, parent = '') {
    const result: any = [];
    const levelMap = {
      1: 'province',
      2: 'city',
      3: 'district',
      4: 'street',
    };
    area.forEach(item => {
      const {
        id, name, center, children = [], level,
      } = item;
      result.push({ id, name, center, parent, level: levelMap[level] }, ...this.flatArea(children, id));
    });
    return result;
  }

  getAreaValueById (adcode, childs = []) {
    const area = this.areaFlatData.find(item => adcode === item.id);
    const result: any = area ? [area, ...childs] : childs;
    return area && area.parent ? this.getAreaValueById(area.parent, result) : result;
  }

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
      if (isiOS && err && err.errorCode === '4') {
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

  onFieldClick () {
    this.pickerShow = true;
  }

  onSelect (selectedData: any[]) {
    if (selectedData && selectedData.length > 0) {
      const lastData = selectedData[selectedData.length - 1];
      const adname = selectedData.map(item => item.name).join(' ');
      if (this.value) {
        this.value.adcode = lastData.id;
        this.value.adname = adname;
      } else {
        this.value = {
          adcode: lastData.id,
          adname: adname,
          Detail: '',
        };
      }
    } else { // 清空操作
      this.value = {
        adcode: '',
        adname: '',
        Detail: '',
      };
    }
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
@import url("~@/styles/mixins.less");
  .form-area-select{
    word-break: break-all;
    word-wrap: break-word;
    .form-field__body {
      font-size: 15px;
      color: #333;
    }
    .form-field__placeholder {
      color: #999;
    }
    .address-detail{
      min-height: 45px;
      padding-right: 23px;
      &--horizontal {
        padding-left: 106px;
        .address-detail__horizon-divide {
          position: relative;
          .hairline('top');
        }
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
      right: 15px;
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
