<template>
  <div id="form-area-selects" v-show="isVisible">
    <!-- <Group >
        <form-address class="dp-font28"  :keyName='keyName' :title="title"
        :popup-title='popupTitle' v-model="currentVal"
        :show="areaPopShow" :list="addressData" :placeholder="placeholder" :hide-district="hideDistrict" :hide-city="hideCity"
         @getAddressName="getAddressName" @clearAddressVal='clearAddressVal' @on-hide='popAddressHide' @on-show='popAddressShow'>
          <template slot="title" slot-scope="props">
            <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
                <span class="area-title" style="vertical-align:middle;color:#333;">{{formVal.DisplayName}}

                </span>
            </span>
          </template>
        </form-address>
        <span class="h3yun_All right-o"></span>
      </Group> -->
    <h3-area-selector
      v-model="currentVal"
      :title="title"
      :show="areaPopShow"
      :mode="formVal.AreaMode"
      :showPlaceHolder="true"
      valueTextAlign="left"
      :list="addressData"
      :placeholder="placeholder"
      @on-hide="popAddressHide"
      @on-show="popAddressShow"
      @onOk="onOk"
    />
  </div>
</template>

<script>
import { H3AreaSelector } from 'h3-mobile-vue';
// import AreaData from '@/store/area-data.json';
import requestPct from '@/utils/request-pct';

// const setLeftCallback = null;
// const EMPTYCODE = '000000';
export default {
  name: 'FormAreaSelect',
  components: {
    H3AreaSelector,
  },
  props: ['formVal'],
  data () {
    return {
      title: this.formVal.DisplayName,
      addressData: [], // 地址数据列表
      placeholder: '请选择地区',
      currentVal: [], // 显示的值
      adcodeName: 'adcode',
      adnameName: 'adname',
      isVisible: true,
      backUpValue: null,
      areaPopShow: false,
    };
  },
  watch: {
    currentVal: {
      handler (newVal) {
        if (!newVal.length) return;
        const isVal = newVal.every(a => !a);
        if (isVal) {
          this.currentVal = [];
        }
      },
    },
  },
  created () {
    this.init();

    requestPct().then(areaData => {
      const { treeData, flatData } = areaData;
      this.addressData = JSON.parse(JSON.stringify(flatData));
      // this.setAddressData(treeData);
    });
  },
  methods: {
    // setAddressData (data) {
    //   for (const province of data) {
    //     if (province.children) {
    //       for (const city of province.children) {
    //         if (city.children) {
    //           this.addressData.push({ id: EMPTYCODE, value: EMPTYCODE, name: '--', level: 'district', parent: city.id });
    //         }
    //       }
    //       this.addressData.push({ id: EMPTYCODE, value: EMPTYCODE, name: '--', level: 'city', parent: province.id });
    //     }
    //   }
    //   // this.addressData.push({ id: EMPTYCODE, value: EMPTYCODE, name: '--', level: 'district', parent: EMPTYCODE });
    // },
    init () {
      if (this.backUpValue) {
        this.setValue(this.backUpValue);
      } else {
        this.setValue(this.formVal.DefaultValue);
      }
    },
    getValue () {
      this.backUpValue = null;
      if (this.value && this.value.adcode) {
        return [JSON.stringify(this.value)];
      }
      return [];
    },
    reset () {
      this.backUpValue = { addressValue: this.currentVal, value: this.value };
      this.currentVal = [];
      this.value = { adcode: '', adname: '', Detail: '' };
    },
    rollBack () {
      if (this.backUpValue) {
        this.currentVal = this.backUpValue.addressValue;
        this.value = this.backUpValue.value;
      }
    },
    setValue (val) {
      let v = val;
      const that = this;
      if (v === null) {
        that.reset();
        return;
      } else if (typeof v === 'object') {
        this.value = v;
        return;
      }
      if (v.trim() === '') {
        that.reset();
        return;
      }
      if (that.IsJsonString(v)) {
        v = v.replace(/[\r\n]/g, ''); // 去掉换行
        v = JSON.parse(v);
        that.value = v;
        if (v[that.adcodeName]) {
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
      const detail = '';
      this.readOnlyVal = `${adname}${detail}`;
      const citykey = adcode.substring(2, 4);
      const townkey = adcode.substring(4, 6);
      let provinceValue = '';
      let citykeyValue = '';
      let townkeyValeu = '';
      if (citykey === '00') {
        provinceValue = adcode;
      } else if (townkey === '00') {
        provinceValue = `${adcode.substring(0, 2)}0000`;
        citykeyValue = `${adcode.substring(0, 4)}00`;
      } else {
        provinceValue = `${adcode.substring(0, 2)}0000`;
        citykeyValue = `${adcode.substring(0, 4)}00`;
        townkeyValeu = adcode;
      }
      const adVal = [];

      adVal.push(provinceValue);
      adVal.push(citykeyValue);
      adVal.push(townkeyValeu);

      that.currentVal = adVal;
    },
    IsJsonString (str) {
      const JSON_START = /^\[|^\{(?!\{)/;
      const JSON_ENDS = {
        '[': /]$/,
        '{': /}$/,
      };
      const jsonStart = str.match(JSON_START);
      return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
    },
    onOk (content) {
      const { val, code } = content;
      let i = code.length - 1;
      let adCode = code[i];
      // while ((!adCode && i >= 0) || adCode === EMPTYCODE) {
      while (!adCode && i >= 0) {
        i -= 1;
        adCode = code[i];
      }
      this.value.adcode = adCode; // 逻辑不够严谨
      this.value.adname = val.split(',').join(' ');
    },
    popAddressHide (val) {
      if (!val) {
        this.reset();
      }
      this.backStack.pop();
      if (!val) {
        this.reset();
      }
    },
    popAddressShow () {
      this.backStack.push(() => {
        this.areaPopShow = false;
      });
    },
  },
};
</script>

<style lang="less">
.px2remimp(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem !important;
}
#form-area-selects {
  background-color: white;
  .h3-field-label-title {
    font-size: 0.37333333rem;
    color: #333;
  }
  .h3-cell_access{
    padding: 0;
    margin-left: .32rem;
  }
  .h3-cell__hd{
    width: 31.73333333%;
  }
  .h3-popup-picker-select-box{
    width: 65.06666667%;
    padding-left: 8%;
    .h3-popup-picker-select{
      span{
        color: #999;
      }
    }
  }
}
</style>
