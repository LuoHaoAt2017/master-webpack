<template>
  <a
  class="h3-datetime h3-cell"
  :class="{'h3-cell_access': !readonly}"
  :data-cancel-text="cancelText"
  :data-confirm-text="confirmText"
  href="javascript:">
    <slot>
      <div>
        <slot name="title">
          <p
          :style="{
            width: $parent.labelWidth,
            textAlign: $parent.labelAlign,
            marginRight: $parent.labelMarginRight
          }"
          :class="labelClass"
          v-html="title"></p>
        </slot>
        <span class="h3-label-desc" v-if="inlineDesc">{{inlineDesc}}</span>
      </div>
      <div class="h3-cell__ft h3-cell-primary h3-datetime-value" :style="{textAlign: valueTextAlign}">
        <span class="h3-cell-placeholder" v-if="!currentValue && placeholder">{{ placeholder }}</span>
        <span class="h3-cell-value" v-if="currentValue">{{ displayFormat ? displayFormat(currentValue) : currentValue }}</span>
        <icon class="h3-input-icon" type="warn" v-show="!valid" :title="firstError"></icon>
      </div>
    </slot>
  </a>
</template>

<script>
import Icon from '../h3-icon/';
import Picker from './datetimepicker';
import Uuid from '../../mixins/uuid';
import format from './format';

export default {
  name: 'datetime',
  mixins: [Uuid],
  components: {
    Icon,
  },
  props: {
    format: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    title: String,
    value: {
      type: String,
      default: '',
    },
    inlineDesc: String,
    placeholder: String,
    minYear: Number,
    maxYear: Number,
    confirmText: String,
    cancelText: String,
    clearText: String,
    yearRow: {
      type: String,
      default: '{value}',
    },
    monthRow: {
      type: String,
      default: '{value}',
    },
    dayRow: {
      type: String,
      default: '{value}',
    },
    hourRow: {
      type: String,
      default: '{value}',
    },
    minuteRow: {
      type: String,
      default: '{value}',
    },
    required: {
      type: Boolean,
      default: false,
    },
    minHour: {
      type: Number,
      default: 0,
    },
    maxHour: {
      type: Number,
      default: 23,
    },
    startDate: {
      type: String,
      validator(val) {
        /* istanbul ignore if */
        if (process.env.NODE_ENV === 'development' && val && val.length !== 10) {
          console.error('[h3] Datetime prop:start-date 必须为 YYYY-MM-DD 格式');
        }
        return val ? val.length === 10 : true;
      },
    },
    endDate: {
      type: String,
      validator(val) {
        /* istanbul ignore if */
        if (process.env.NODE_ENV === 'development' && val && val.length !== 10) {
          console.error('[h3] Datetime prop:end-date 必须为 YYYY-MM-DD 格式');
        }
        return val ? val.length === 10 : true;
      },
    },
    valueTextAlign: String,
    displayFormat: Function,
    readonly: Boolean,
    hourList: Array,
    minuteList: Array,
    show: Boolean,
    defaultSelectedValue: String,
    computeHoursFunction: Function,
    computeDaysFunction: Function,
  },
  created() {
    this.isFirstSetValue = false;
    this.currentValue = this.value;
  },
  data() {
    return {
      currentShow: false,
      currentValue: null,
      valid: true,
      errors: {},
    };
  },
  mounted() {
    const uuid = this.uuid;
    this.$el.setAttribute('id', `h3-datetime-${uuid}`);
    if (!this.readonly) {
      this.$nextTick(() => {
        this.render();

        if (this.show) {
          this.$nextTick(() => {
            if (this.picker) {
              this.picker.show(this.currentValue);
            }
          });
        }
      });
    }
  },
  computed: {
    pickerOptions() {
      const self = this;
      const options = {
        trigger: `#h3-datetime-${this.uuid}`,
        format: this.format,
        value: this.currentValue,
        output: '.h3-datetime-value',
        confirmText: self.getButtonText('confirm'),
        cancelText: self.getButtonText('cancel'),
        clearText: self.clearText,
        yearRow: this.yearRow,
        monthRow: this.monthRow,
        dayRow: this.dayRow,
        hourRow: this.hourRow,
        minuteRow: this.minuteRow,
        minHour: this.minHour,
        maxHour: this.maxHour,
        startDate: this.startDate,
        endDate: this.endDate,
        hourList: this.hourList,
        minuteList: this.minuteList,
        defaultSelectedValue: this.defaultSelectedValue,
        computeHoursFunction: this.computeHoursFunction,
        computeDaysFunction: this.computeDaysFunction,
        onSelect(type, val, wholeValue) {
          if (self.picker && self.picker.config.renderInline) {
            self.$emit('input', wholeValue);
            self.$emit('on-change', wholeValue);
          }
        },
        onConfirm(value) {
          self.currentValue = value;
        },
        onClear(value) {
          self.$emit('on-clear', value);
        },
        onHide(type) {
          self.currentShow = false;
          self.$emit('update:show', false);
          self.validate();
          self.$emit('on-hide', type);
          if (type === 'cancel') {
            self.$emit('on-cancel');
          }
          if (type === 'confirm') {
            self.$emit('on-confirm');
          }
        },
        onShow() {
          self.currentShow = true;
          self.$emit('update:show', true);
          self.$emit('on-show');
        },
      };
      if (this.minYear) {
        options.minYear = this.minYear;
      }
      if (this.maxYear) {
        options.maxYear = this.maxYear;
      }
      return options;
    },
    firstError() {
      const key = Object.keys(this.errors)[0];
      return this.errors[key];
    },
    labelClass() {
      return {
        'h3-cell-justify': this.$parent.labelAlign === 'justify' ||
        this.$parent.$parent.labelAlign === 'justify',
      };
    },
  },
  methods: {
    getButtonText(type) {
      if (type === 'cancel' && this.cancelText) {
        return this.cancelText;
      } else if (type === 'confirm' && this.confirmText) {
        return this.confirmText;
      }
      return this.$el.getAttribute(`data-${type}-text`);
    },
    render() {
      this.$nextTick(() => {
        if (this.picker) {
          this.picker.destroy();
        }
        this.picker = new Picker(this.pickerOptions);
      });
    },
    validate() {
      if (!this.currentValue && this.required) {
        this.valid = false;
        this.errors.required = '必填';
        return;
      }
      this.valid = true;
      this.errors = {};
    },
  },
  watch: {
    readonly(val) {
      if (val) {
        if (this.picker) {
          this.picker.destroy();
        }
      } else {
        this.render();
      }
    },
    show(val) {
      if (val === this.currentShow) return;
      if (val) {
        if (this.picker) {
          this.picker.show(this.currentValue);
        }
      } else if (this.picker) {
        this.picker.hide(this.currentValue);
      }
    },
    currentValue(val, oldVal) {
      this.$emit('input', val);
      if (!this.isFirstSetValue) {
        this.isFirstSetValue = true;
        if (oldVal) {
          this.$emit('on-change', val);
        }
      } else {
        this.$emit('on-change', val);
      }
      this.validate();
    },
    startDate() {
      this.render();
    },
    endDate() {
      this.render();
    },
    format(val) {
      if (this.currentValue) {
        this.currentValue = format(this.currentValue, val);
      }
      this.render();
    },
    value(val) {
      // do not force render when renderInline is true
      if (this.readonly || (this.picker && this.picker.config.renderInline)) {
        this.currentValue = val;
        return;
      }
      if (this.currentValue !== val) {
        this.currentValue = val;
        this.render();
      }
    },
  },
  beforeDestroy() {
    if (this.picker) {
      this.picker.destroy();
    }
  },
};
</script>

<style lang="less">
@import './style/index.less';
</style>
