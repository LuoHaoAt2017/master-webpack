<template>
  <ControlWrapper
    class="form-date-time"
    :visible="visible"
    :error="valid.empty"
    :disabled="disabled"
  >
    <!-- <h3-list>
        <h3-input
          type='text'
          :required="options.Required"
          :placeholder="placeholder"
          :tip="options.description"
          :title="options.DisplayName"
          :value="value"
          :editable="editable"
          :readonly="!editable"
          :error="valid.empty"
          @click.native="setDate(formatDateMode)"
          >
          <div class="datetime-right-icon">
            <i class="icon aufont icon-base-right datetime-icon"></i>
          </div>
        </h3-input>
      </h3-list> -->
    <h3-datetime
      v-model="value"
      :required="options.Required"
      :readonly="!editable"
      :placeholder="placeholder"
      :tip="options.description"
      :title="options.DisplayName"
      :format="formatDateMode"
      :show="pickerShow"
      confirmText="确定"
      cancelText="取消"
      clearText="清除"
      :layout="controlLayout"
      @on-show="onShow"
      @on-hide="onHide"
      @on-clear="onClear"
      @onConfirm="onConfirm"
    />
  </ControlWrapper>
</template>
<script lang='ts'>
import { H3Datetime } from 'h3-mobile-vue';
import { Component, Mixins } from 'vue-property-decorator';
import mixin from '../mixins/base-controler';
import { FormDateTimeOptions } from '@/lib/form-logic/types/control-options-map';
import ControlWrapper from '../shared/control-wrapper.vue';

// notice
// yyyy-mm-dd
// yyyy-mm
// yyyy-mm-dd hh:ii
// hh:ii
@Component({
  components: {
    ControlWrapper,
    H3Datetime,
  },
})
export default class FormDateTime extends Mixins(mixin) {
    placeholder: string = '请选择';

    formatDateMode: string = 'YYYY-MM-DD';

    pickerShow: boolean = false;

    options!: FormDateTimeOptions;

    created () {
      this.init();
    }

    mounted () {}

    // 初始化
    init () {
      if (this.options.datetimemode === 'yyyy-mm-dd') {
        // this.placeholder = '年-月-日';
        this.formatDateMode = 'YYYY-MM-DD';
      } else if (this.options.datetimemode === 'yyyy-mm') {
        // this.placeholder = '年-月';
        this.formatDateMode = 'YYYY-MM';
      } else if (this.options.datetimemode === 'hh:ii' || this.options.datetimemode === 'hh:mm') {
        // this.placeholder = '时:分';
        this.formatDateMode = 'HH:mm';
      } else {
        // this.placeholder = '年-月-日 时:分';
        this.formatDateMode = 'YYYY-MM-DD HH:mm';
      }
    }

    setDate (mode) {
      if (this.editable) {
        const self = this;
        self.valid.empty = false;
        self.$h3.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          clearText: '清除',
          currentText: '此刻',
          format: mode,
          value: self.value,
          onConfirm (value) {
            self.value = value;
          },
          onShow () {},
          onHide () {},
          onClear () {
            self.value = '';
          },
        });
      }
    }

    onConfirm (value:any) {
      this.value = value;
      console.log(value);
      // 触发执行前端事件
      // if (this.value) {
      //   this.getFrontEventsValue({
      //     value: this.value,
      //     namespace: this.namespace,
      //   });
      // }
    }

    onClear () {
      this.value = '';
    }

    onShow () {
      // 修复由其他焦点引起的输入法弹出覆盖日期
      const activeElement:any = document.activeElement;
      if (activeElement) {
        activeElement.blur();
      }
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
