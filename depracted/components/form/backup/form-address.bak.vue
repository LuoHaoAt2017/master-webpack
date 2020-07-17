<template>
    <popup-picker ref="popupPicker" :fixed-columns="hideDistrict ?(hideCity ? 1 : 2): 0" :columns="3" :popupTitle='popupTitle' :data="list" :title="title" v-model="currentValue" show-name :inline-desc="inlineDesc" :placeholder="placeholder" @on-hide="emitHide" @on-show="$emit('on-show')" :value-text-align="valueTextAlign" :confirm-text="confirmText" :cancel-text="cancelText" :display-format="displayFormat" :popup-style="popupStyle" :show.sync="showValue" @on-shadow-change="onShadowChange">
        <template slot="title" slot-scope="props">
            <slot name="title" :label-class="props.labelClass" :label-style="props.labelStyles" :label-title="props.title">
                <label :class="[props.labelClass,labelClass]" :style="props.labelStyle" v-if="props.labelTitle" v-html="props.labelTitle"></label>
            </slot>
        </template>
    </popup-picker>
</template>
<script>
import { PopupPicker } from 'vux';
import name2value from '../../../lib/name2value';
import value2name from '../../../lib/value2name';

export default {
  name: 'FormAddress',
  components: {
    PopupPicker,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    ObjectId: {},
    keyName: {},
    popupTitle: {
      type: String,
      required: true,
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    rawValue: Boolean,
    list: {
      type: Array,
      required: true,
    },
    labelWidth: String,
    inlineDesc: String,
    placeholder: String,
    hideDistrict: Boolean,
    hideCity: Boolean,
    valueTextAlign: String,
    confirmText: String,
    cancelText: String,
    displayFormat: {
      type: Function,
      default: (val, names) => names,
    },
    popupStyle: Object,
    show: Boolean,
  },
  created() {
    if (this.currentValue.length && this.rawValue) {
      const parsedVal = name2value(this.currentValue, this.list);
      if (/__/.test(parsedVal)) {
        this.currentValue = [];
      } else {
        this.currentValue = parsedVal.split(' ');
      }
    }
    if (this.show) {
      this.showValue = true;
    }
  },
  mounted() {
    const $popupTitleEl = $('.vux-popup-header-title');
    $popupTitleEl.click(() => {
      this.$emit('clearAddressVal', { ObjectId: this.ObjectId, keyName: this.keyName });
    });
  },
  methods: {
    emitHide(val) {
      this.$emit('on-hide', val);
    },
    getAddressName() {
      return value2name(this.value, this.list);
    },
    onShadowChange(ids, names) {
      this.$emit('on-shadow-change', ids, names);
    },
  },
  data() {
    return {
      currentValue: this.value,
      showValue: false,
    };
  },
  computed: {
    nameValue() {
      return value2name(this.currentValue, this.list);
    },
    labelClass() {
      return {
        'vux-cell-justify': this.$parent.labelAlign === 'justify' || this.$parent.$parent.labelAlign === 'justify',
      };
    },
  },
  watch: {
    currentValue(vals) {
      const val = vals;
      this.$emit('input', val);
      if (val.length && !val[1]) {
        val[2] = null;
      }
      const nameValue = value2name(val, this.list);
      this.$emit('getAddressName', nameValue);
    },
    value(val) {
      if (val && val.length && !/\d+/.test(val[0])) {
        const id = name2value(val, this.list).split(' ');
        if (id[0] !== '__' && id[1] !== '__') {
          this.currentValue = id;
          return;
        }
      }
      this.currentValue = val;
    },
    show(val) {
      this.showValue = val;
    },
    showValue(val) {
      this.$emit('update:show', val);
      if (val) {
        this.$refs.popupPicker.onPickerChange(['110000', '110100', '110101']);
        this.$refs.popupPicker.tempValue = ['110000', '110100', '110101'];
      }
    },
  },
};
</script>