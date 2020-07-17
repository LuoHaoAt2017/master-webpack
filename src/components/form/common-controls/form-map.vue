<template>
  <ControlWrapper
    class="form-map"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <h3-field
      :class="wrapCls"
      :label="options.DisplayName"
      :required="editable && options.Required"
      :showIcon="iconShow"
      :layout="controlLayout"
      @contentClick="goToMapPage"
    >
      <div class="form-map-content">
        <textarea
          id="FormMapTextarea"
          v-model="value.Address"
          :class="{'h3-field-placeholder': !value.Address}"
          rows="1"
          :placeholder="editable ? placeholder : ''"
          readonly
          onfocus="blur()"
        ></textarea>
      </div>
      <div
        v-if="editable"
        slot="extra"
        class="icon-wapper"
        @click="goToMapPage($event)"
      >
        <i v-if="value.Address" class="icon-clear"></i>
        <span class="icon h3yun_All get-address-o"></span>
      </div>
    </h3-field>
  </ControlWrapper>
</template>

<script lang="ts">
import { H3Field } from 'h3-mobile-vue';
import { Component, Watch, Mixins } from 'vue-property-decorator';
import baseControler from '../mixins/base-controler';
import ControlWrapper from '../shared/control-wrapper.vue';
import {
  getLocation, getMapView, searchMapLocation, locateMapLocation,
} from '../../../config/dingtalk-interface';
import { FormMapOptions } from '@/lib/form-logic/types/control-options-map';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { isDingtalk, isiOS } from '@/config/common';

@Component({
  components: {
    H3Field,
    ControlWrapper,
  },
})
export default class FormMap extends Mixins(baseControler) {
  placeholder: string = '点击获取当前位置';

  options!: FormMapOptions;

  get isEmpty () {
    return this.value &&
      this.value.Point &&
      this.value.Point.lat === 0 &&
      this.value.Point.lng === 0;
  }

  get wrapCls () {
    return {
      error: this.valid.empty,
    };
  }

  get iconShow () {
    // 禁用状态
    if (this.disabled) {
      return false;
    }
    // 只读状态时，图标不予显示
    if (!this.editable) {
      return !this.isEmpty;
    }
    return true;
  }

  @Watch('value.Address')
  addressChanged () {
    this.setAutoHeight();
  }

  mounted () {
    this.setAutoHeight();
  }

  goToMapPage (event) {
    this.clearValid();

    if (this.disabled) {
      return;
    }

    if (!this.editable) {
      this.getToMapView();
      return;
    }

    // 清除位置信息
    if (event && event.target.className === 'icon-clear') {
      this.clearValue();
      return;
    }

    if (isDingtalk) {
      getLocation((data) => {
        this.getLocationByDing(data);
      }, false, (err) => {
        if (isiOS && err.errorCode === '4') {
          H3PluginDeveloper.IShowWarn('定位权限未开启，请开启权限后重试');
        }
      });
    } else {
      this.value = {
        Address: '假数据：广东省深圳市南山区科兴科学园B4 603',
        Point: {
          lat: 222,
          lng: 34,
        },
      };
    }
  }

  /**
   * 展示位置
   */
  getToMapView () {
    if (!this.isEmpty) {
      getMapView({
        latitude: this.value.Point.lat, // 纬度
        longitude: this.value.Point.lng, // 经度
        title: this.value.Address, // 地址/POI名称
      });
    }
  }

  getLocationByDing (result) {
    if (this.options.range === '0') {
      searchMapLocation(this.setLatitude, result.latitude, result.longitude);
    } else {
      locateMapLocation(this.setLatitude, result.latitude, result.longitude);
    }
  }

  // 设置手动定位的值
  setLatitude (result) {
    const poidata = {
      Address: result.province + result.city + result.adName + result.snippet + result.title,
      Point: {
        lat: result.latitude,
        lng: result.longitude,
      },
    };
    this.value = poidata;
  }

  // 清空
  clearValue () {
    this.value = {
      Address: '',
      Point: {
        lat: 0,
        lng: 0,
      },
    };
  }

  setAutoHeight () {
    this.$nextTick(() => {
      const textarea = document.querySelector('#FormMapTextarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight < 24 ? 24 : textarea.scrollHeight}px`;
      }
    });
  }
}
</script>

<style lang="less">
@import '~@/styles/form-base.less';
.form-map {
  position: relative;
  .form-map-content{
    padding-right: 16px;
    textarea{
      width: 100%;
      vertical-align: middle;
      padding: 0;
      font-size: 15px;
      color: inherit;
    }
  }
  .icon-wapper{
    position: relative;
    display: inline-block;
    width: 30px;
    text-align: center;
    .get-address-o {
      font-size: 16px;
    }
    .icon-clear {
      display: inline-block;
      position: absolute;
      right: 25px;
      top: 13px;
      width: 16px;
      height: 16px;
      background: #999999;
      border-radius: 50%;
      transform: rotate(45deg);
      .mixin(@width, @height) {
        background: #fff;
        content: "";
        position: absolute;
        display: inline-block;
        width: @width;
        height: @height;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      &:before {
        .mixin(1px, 12px);
      }
      &:after {
        .mixin(12px, 1px);
      }
      &.hide {
        display: none;
      }
      &.offset {
        right: calc(22px + .32rem);
      }
    }
  }
}
</style>
