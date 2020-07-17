// 所有控件的公用方法，计算规则，隐藏规则
import { Vue, Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import BaseOptions from '@/lib/form-logic/types/base-options';
import { activeFromEvent } from '@/service/form.service';

const FormVM = namespace('Form/ViewModel');
const FormModule = namespace('Form');
const watch = arg => arg;
// 手动更新控件
const handUpdates = ['FormTextArea', 'FormTextBox'];

@Component
export default class BaseControlMixin extends Vue {
  @Prop({ type: String })
  dataField!: string;

  @Prop({ type: Object })
  control!: any;

  @Prop({ type: String })
  namespace!: string;

  @Prop({ type: Boolean })
  isIngrid!: boolean;

  $parent!: {
    context: any;
    form: any;
    dataField: string;
  } & Vue;

  validate () { return true; }

  @FormModule.State('isSecondaryForm') isSecondaryForm;

  @FormModule.State('frontEvents') frontEvents; // 前端事件

  @FormVM.Action(ViewModelAction.INPUT) inputValue;

  @FormVM.Action(ViewModelAction.QUERYFILTER) queryFilterData;

  @FormVM.Action(ViewModelAction.TRIGGERCLICK) triggerClick;

  clearValid () {
    if (this.editable) {
      const prefix = 'Form/ViewModel/';
      this.$store.dispatch(prefix + ViewModelAction.CLEARVALID, {
        namespace: this.namespace,
      });
    }
  }

  $updateValue (val?: string) {
    const value = typeof val !== 'undefined' ? val : this.value;
    this.inputValue({
      namespace: this.namespace,
      value: value,
    });
  }

  hideQuestion () {
  }

  get value (): any {
    // notice 用于显式依赖, 获取在子表中的更新
    watch(this.notice);
    return this.$parent.context[this.dataField].value;
  }

  set value (val: any) {
    if (handUpdates.indexOf(this.options.controlkey) !== -1) {
      return;
    }
    this.inputValue({
      namespace: this.namespace,
      value: val,
    });
  }

  get valid () {
    watch(this.notice);
    const valid = this.$parent.context[this.dataField].valid;
    return valid || {};
  }

  get visible (): boolean {
    watch(this.notice);
    return this.$parent.context[this.dataField].visible;
  }

  get options (): BaseOptions {
    watch(this.notice);
    return this.$parent.context[this.dataField].options;
  }

  get notice () {
    const mainDataField = this.$parent.dataField;
    if (mainDataField) {
      return this.$parent.form[mainDataField].noticeMap[this.dataField];
    }
    return null;
  }

  get editable () {
    watch(this.notice);
    return this.$parent.context[this.dataField].editable;
  }

  get hasBindClick () {
    watch(this.notice);
    return this.$parent.context[this.dataField].hasBindClick || false;
  }

  get disabled (): boolean {
    const responseContext = this.$parent.form.$responseContext;
    // 表单可编辑状态，控件不可编辑状态
    return (responseContext.IsCreateMode || responseContext.FormMode === 0 || responseContext.FormMode === 2) &&
    !this.editable;
  }

  get IsCreateMode () {
    return this.$parent.form.$responseContext.IsCreateMode;
  }

  get controlLayout () {
    const mobileLayout = this.$parent.form.$responseContext.MobileLayout;
    return {
      1: 'v', // vertical 垂直
      2: 'h', // horizon 水平
    }[mobileLayout] || 'v';
  }

  // 获取前端事件返回的控件值
  getFrontEventsValue (data) {
    const codeArr = data.namespace.split('/');
    const id = codeArr[0];
    const controlCode = codeArr[1];
    if (!this.frontEvents[controlCode] || !data.value) {
      return;
    }
    this.frontEvents[controlCode].forEach(async item => {
      const relyFieldCodes = item.relyFieldCodes;
      if (!relyFieldCodes.length) {
        return false;
      }
      const params = relyFieldCodes.map(code => {
        let value = '';
        if (code === controlCode) {
          value = data.value;
        }
        return {
          code,
          value: value,
        };
      });
      const res = await activeFromEvent({
        id: item.id,
        eventRely: params,
      });
      if (res.success) {
        const { result } = res.returnData;
        result.forEach(value => {
          this.inputValue({
            namespace: `${id}/${value.code}`,
            value: value.value,
          });
        });
      }
    });
  }
}
