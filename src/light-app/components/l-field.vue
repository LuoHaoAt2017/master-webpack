<template>
  <div :class="autoDefClass">
    <l-label
      :title="title"
      :required="required"
    >
      <l-input
        :class="inputClassName"
        v-if="type !== 'textarea'"
        :icon="icon"
        :type="type"
        ref="input"
        :maxLength="maxLength"
        :placeholder="placeholder"
        :otherOptions="otherOptions"
        :disabled="disabled"
        :value="value"
        :errorMsg="errorMsg"
        :readonly="readonly"
        @input="inputChange"
        @blur="handleBlur"
        @focus="handleFocus"
      ></l-input>
      <l-textarea
        v-else
        :class="inputClassName"
        :icon="icon"
        ref="textarea"
        :maxLength="maxLength"
        :id="id"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="value"
        :errorMsg="errorMsg"
        :readonly="readonly"
        @input="inputChange"
        @blur="handleBlur"
        @focus="handleFocus"
        @click="handleClick"
      ></l-textarea>
    </l-label>
    <transition name="show">
      <div
        v-if="error || errorMsg"
        class="error-box"
      >
        {{error || errorMsg}}
      </div>
    </transition>
  </div>

</template>

<script lang='ts'>
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import cx from 'classnames';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import LLabel from './l-label.vue';
import LInput from './l-input.vue';
import LTextarea from './l-textarea.vue';

@Component({
  name: 'LField',
  components: {
    LLabel,
    LInput,
    LTextarea
  }
})
export default class LField extends Vue {
  @Prop()
  title!: string;
  @Prop({ default: '' })
  value?: any;
  @Prop({ default: '' })
  defaultValue?: string;
  @Prop({ default: 32 })
  maxLength?: number;
  @Prop()
  id?: string;
  @Prop({ default: '请输入' })
  placeholder?: string;
  @Prop({ default: 'text' })
  type?: string;
  @Prop({ default: false })
  disabled!: boolean;
  @Prop({ default: false })
  readonly!: boolean;
  @Prop({ default: '' })
  error?: string;
  @Prop({ default: true })
  required?: boolean;
  @Prop()
  validate?: Function;
  @Prop()
  icon?: string;
  @Prop()
  className?: string;

  @Prop()
  otherOptions?: any;

  errorMsg: string = '';
  inputClassName: string = '';
  $refs: {
    input: LInput;
    textarea: LTextarea;
  };

  get autoDefClass() {
    return cx('app-field-container', this.className);
  }

  inputChange(e) {
    this.$emit('input', e);
  }
  handleBlur(e) {
    const value = e.target.value;
    if (this.required && !value) {
      this.errorMsg = '此项为必填项';
    }
    if (this.validate) {
      this.errorMsg = this.validate(e.target.value);
    }
    this.$emit('blur', e);
  }
  handleFocus(e) {
    this.errorMsg = '';
    this.$emit('focus', e);
  }
  handleClick(e) {
    this.$emit('click', e);
  }
  autofocus() {
    this.errorMsg = '';
    if (this.type === 'text') {
      this.$refs.input.focus();
    }
    if (this.type === 'textarea') {
      this.$refs.textarea.focus();
    }
  }
}
</script>

<style lang='less' scoped>
.app-field-container {
  position: relative;
  padding-bottom: 0.32rem!important;
}
.error-box {
  position: absolute;
  bottom: 0;
  color: #ef503e;
  font-size: 0.32rem;
}
.show-enter-active {
  transition: all 0.3s ease;
}
.show-leave-active {
  transition: all 0.3s ease;
}
.show-enter {
  opacity: 1;
}
.show-leave-to {
  opacity: 0;
}
</style>
