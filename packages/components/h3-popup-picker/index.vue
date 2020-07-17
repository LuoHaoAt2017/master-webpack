<template>
  <div class="h3-cell-box">
    <div class="h3-cell h3-tap-active h3-cell_access" @click="onClick" v-show="showCell">
      <div class="h3-cell__hd">
        <slot name="title" label-class="h3-label" :label-style="labelStyles" :label-title="title">
          <label class="h3-label" :class="labelClass" :style="labelStyles" v-if="title" v-html="title"></label>
        </slot>
        <div class="h3-field-label-tip" ref="trigger" v-if="tip" @click.stop="toggleTip">
          <i class="icon aufont icon-base-question-circle-o" v-if="tip"></i>
        </div>
        <inline-desc v-if="inlineDesc">{{ inlineDesc }}</inline-desc>
      </div>
      <div class="h3-cell-primary h3-popup-picker-select-box">
        <div class="h3-popup-picker-select" :style="{textAlign: valueTextAlign}">
          <span class="h3-popup-picker-value h3-cell-value" v-if="!displayFormat && !showName && value.length">{{value | array2string}}</span>
          <span class="h3-popup-picker-value h3-cell-value" v-if="!displayFormat && showName && value.length">{{value | value2name(data)}}</span>
          <span class="h3-popup-picker-value h3-cell-value" v-if="displayFormat && value.length">{{ displayFormat(value, value2name(value, data)) }}</span>
          <span v-if="!value.length && placeholder" v-text="placeholder" class="h3-popup-picker-placeholder h3-cell-placeholder"></span>
        </div>
      </div>
      <div class="h3-cell__ft">
      </div>
      <i class="icon aufont icon-base-right"></i>
    </div>

    <div v-transfer-dom="isTransferDom">
      <popup
      v-model="showValue"
      class="h3-popup-picker"
      :id="`h3-popup-picker-${uuid}`"
      @on-hide="onPopupHide"
      @on-show="onPopupShow"
      :popup-style="popupStyle">
        <div class="h3-popup-picker-container">
          <popup-header
          :cancel-text="cancelText"
          :clear-text="clearText"
          :right-text="confirmText"
          @on-click-cancel="onHide(menuType.cancel)"
          @on-click-clear="onHide(menuType.clear)"
          @on-click-right="onHide(menuType.ok)"
          :title="popupTitle"></popup-header>
          <picker
          :data="data"
          v-model="tempValue"
          @on-change="onPickerChange"
          :columns="columns"
          :fixed-columns="fixedColumns"
          :container="'#h3-popup-picker-'+uuid"
          :column-width="columnWidth"></picker>
        </div>
      </popup>
    </div>

  </div>
</template>


<script>
import Picker from '../h3-picker';
import Cell from '../h3-cell';
import { H3Popup as Popup, H3PopupHeader as PopupHeader } from '../h3-popup';
import InlineDesc from '../h3-inline-desc';
import { H3Flexbox as Flexbox, H3FlexboxItem as FlexboxItem } from '../h3-flexbox';
import array2string from '../../filters/array2string';
import value2name from '../../filters/value2name';
// import uuidMixin from '../../libs/mixin_uuid';
import TransferDom from '../../directives/transfer-dom';

const getObject = obj => JSON.parse(JSON.stringify(obj));

const createId = () => Math.random().toString(36).substring(3, 8);

export default {
  name: 'popup-picker',
  directives: {
    TransferDom,
  },
  created() {
    if (typeof this.show !== 'undefined') {
      this.showValue = this.show;
    }
  },
  components: {
    Picker,
    Cell,
    Popup,
    PopupHeader,
    Flexbox,
    FlexboxItem,
    InlineDesc,
  },
  filters: {
    array2string,
    value2name,
  },
  props: {
    valueTextAlign: {
      type: String,
      default: 'right',
    },
    title: String,
    cancelText: String,
    clearText: String,
    confirmText: String,
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    placeholder: String,
    columns: {
      type: Number,
      default: 0,
    },
    fixedColumns: {
      type: Number,
      default: 0,
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    showName: Boolean,
    inlineDesc: [String, Number, Array, Object, Boolean],
    showCell: {
      type: Boolean,
      default: true,
    },
    show: Boolean,
    displayFormat: Function,
    isTransferDom: {
      type: Boolean,
      default: true,
    },
    columnWidth: Array,
    popupStyle: Object,
    popupTitle: String,
    tip: {
      type: String,
    },
  },
  data() {
    return {
      tipVisible: false,
    };
  },
  computed: {
    labelStyles() {
      return {
        display: 'block',
        width: this.$parent.labelWidth || this.$parent.$parent.labelWidth || 'auto',
        textAlign: this.$parent.labelAlign || this.$parent.$parent.labelAlign,
        marginRight: this.$parent.labelMarginRight || this.$parent.$parent.labelMarginRight,
      };
    },
    labelClass() {
      return {
        'h3-cell-justify': this.$parent.labelAlign === 'justify' || this.$parent.$parent.labelAlign === 'justify',
      };
    },
  },
  methods: {
    value2name,
    getNameValues() {
      return value2name(this.currentValue, this.data);
    },
    onClick() {
      this.showValue = true;
    },
    onHide(type) {
      this.showValue = false;
      switch (type) {
        case this.menuType.cancel:
          this.closeType = false;
          if (this.value.length > 0) {
            this.tempValue = getObject(this.currentValue);
          }
          break;
        case this.menuType.clear:
          this.closeType = false;
          this.tempValue = [];
          this.currentValue = [];
          break;
        case this.menuType.ok:
          this.closeType = true;
          this.currentValue = getObject(this.tempValue);
          break;
        default:
          break;
      }
    },
    onPopupShow() {
      // reset close type to false
      this.closeType = false;
      this.$emit('on-show');
    },
    onPopupHide() {
      if (this.value.length > 0) {
        this.tempValue = getObject(this.currentValue);
      }
      this.$emit('on-hide', this.closeType);
    },
    onPickerChange(val) {
      if (JSON.stringify(this.currentValue) !== JSON.stringify(val)) {
        // if has value, replace it
        if (this.value.length) {
          const nowData = JSON.stringify(this.data);
          if (nowData !== this.currentData && this.currentData !== '[]') {
            this.tempValue = getObject(val);
          }
          this.currentData = nowData;
        } else { // if no value, stay quiet
          // if set to auto update, do update the value
        }
      }
      const $val = getObject(val);
      this.$emit('on-shadow-change', $val, value2name($val, this.data).split(' '));
    },
    toggleTip() {
      this.tipVisible = !this.tipVisible;
      this.$emit('onToggleTip', this.tipVisible);
    },
  },
  watch: {
    value(val) {
      if (JSON.stringify(val) !== JSON.stringify(this.tempValue)) {
        this.tempValue = getObject(val);
        this.currentValue = getObject(val);
      }
    },
    currentValue(val) {
      this.$emit('input', getObject(val));
      this.$emit('on-change', getObject(val));
    },
    show(val) {
      this.showValue = val;
    },
    showValue(val) {
      this.$emit('update:show', val);
    },
  },
  data() {
    return {
      onShowProcess: false,
      tempValue: getObject(this.value),
      closeType: false,
      currentData: JSON.stringify(this.data), // used for detecting if it is after data change
      showValue: false,
      currentValue: this.value,
      uuid: createId(),
      menuType: {
        cancel: 0,
        clear: 1,
        ok: 2,
      },
    };
  },
};
</script>

<style lang="less">
@import '../../styles/mixins.less';

.h3-cell-primary {
  flex: 1;
}
.h3-cell-box {
  position: relative;
}
.h3-cell-box:not(:first-child):before {
  content: " ";
  position: absolute;
  top: 0;
  width: 100%;
  height: 1px;
  border-top: 1px solid #D9D9D9;
  color: #D9D9D9;
  transform-origin: 0 0;
  transform: scaleY(0.5);
  left: 15px;
}
.h3-popup-picker-header {
  height: 44px;
  color: @popup-picker-header-text-color;
  background-color: @popup-picker-header-bg-color;
  font-size: @popup-picker-header-font-size;
  position: relative;
  &:after {
    .setBottomLine(#e5e5e5);
  }
}
.h3-popup-picker-value {
  /* display: inline-block; */
}
.h3-popup-picker-header-menu {
  text-align: left;
  padding-left: 15px;
  line-height: 44px;
}
.h3-popup-picker-header-menu-right {
  text-align: right;
  padding-right: 15px;
}
.h3-popup-picker-select {
  width: 100%;
  position: relative;
}
.h3-popup-picker-select-box.h3-cell__bd:after {
  content: " ";
  display: inline-block;
  transform: rotate(45deg);
  height: 6px;
  width: 6px;
  border-width: 2px 2px 0 0;
  border-color: #C8C8CD;
  border-style: solid;
  position: relative;
  top: -2px;
  position: absolute;
  top: 50%;
  right: 15px;
  margin-top: -3px;
}
.h3-popup-picker-cancel {
  color: @popup-picker-header-cancel-text-color;
}
.h3-popup-picker-placeholder {
  color: #999;
}
</style>
