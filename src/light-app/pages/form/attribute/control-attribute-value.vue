
<script lang='ts'>
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import { LLabel, LField } from '@/light-app/components';
import {
  Check,
  TextMode,
  LRadio,
  LSelect,
  UserOrg,
  Association,
  Verify
} from './component';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { AttributeType } from '@/light-app/config/const';
import { H3Modal } from 'h3-mobile-vue';
import { RenderType } from './types.d';
@Component({
  name: 'ControlAttributeValue',
  components: {
    LLabel,
    LField,
    Check,
    TextMode,
    LRadio,
    LSelect,
    UserOrg,
    Association,
    Verify
  }
})
export default class ControlAttributeValue extends Vue {
  @Prop()
  attrOptions!: any; //所渲染的组件选项，如默认值
  @Prop()
  attrContent!: any; //渲染组件所需要的数据，如label，icon等
  @Prop()
  attributes!: any; //同级其他组件

  created() {}

  // 验证
  verifyRender(h: any): any {
    const self = this;
    const permission: any = {
      '-1': [],
      '0': [0],
      '1': [0, 1],
      '2': [0, 1, 2]
    };
    if (typeof self.attrOptions.defaultValue === 'number') {
      self.attrOptions.defaultValue = permission[self.attrOptions.defaultValue.toString()];     
    }

    const options: RenderType = {
      on: {
        change: (value: number) => {
          self.attrOptions.defaultValue = [...permission[value.toString()]];
          self.$emit('listenData', self.attrContent.name, value);
        }
      },
      props: {
        value: self.attrOptions.defaultValue,
        title: self.attrContent.label,
        list: self.attrContent.options.list
      }
    };
    return h('verify', options);
  }

  // 人员部门范围选择
  userOrgRender(h: any): any {
    const self = this;
    const options: RenderType = {
      on: {
        change: (value: string) => {
          self.$emit('listenData', self.attrContent.name, value);
        }
      },
      props: {
        list: self.attrContent.options.list,
        value: self.attrOptions.defaultValue,
        title: self.attrContent.label
      }
    };
    return h('user-org', options);
  }

  // 单选
  radioRender(h: any): any {
    const self = this;
    const options: RenderType = {
      on: {
        click: (value: string) => {
          self.$emit('listenData', self.attrContent.name, value);
        }
      },
      props: {
        list: self.attrContent.options.list,
        defaultValue: self.attrOptions.defaultValue,
        title: self.attrContent.label
      }
    };
    return h('l-radio', options);
  }

  // 选项框
  selectRender(h: any): any {
    const self = this;
    const options: RenderType = {
      on: {
        click: (payload: any) => {
          self.$emit('listenData', self.attrContent.name, payload);
        },
        change: (value: string) => {
          self.$emit('listenData', 'DefaultValue', value);
        }
      },
      props: {
        list: self.attrOptions.defaultItems,
        defaultValue: self.attrOptions.defaultValue,
        type: self.attrOptions.type
      }
    };
    return h('l-select', options);
  }

  // 文本格式
  modeRender(h: any): any {
    const self = this;
    const options: RenderType = {
      on: {
        click: (value: string) => {
          self.$emit('listenData', self.attrContent.name, value);
        }
      },
      props: {
        list: self.attrContent.options.list,
        defaultValue: self.attrOptions.defaultValue
      }
    };
    return h('text-mode', options);
  }

  // 输入框
  stringRender(h: any): any {
    const self = this;
    const options: RenderType = {
      on: {
        input: (value: any) => {
          let newVal = value;
          if(self.attrContent.options) {
          const numberValid: any = self.attrContent.options.regexps.numberValid;
          const numberOnly: any = self.attrContent.options.regexps.numberOnly;
          if (numberOnly) {
            if (!isNaN(value)) {
              if (numberValid.int) {
                const reg = /^0\d+/g;
                let valStr = value.toString();
                if (reg.test(valStr)) {
                  valStr = valStr.replace(/^0/, '');
                }
                newVal = valStr.replace(/\.\d*/, '');

                if (Number(newVal) > numberValid.max) {
                  newVal = numberValid.max.toString();
                } else if (Number(newVal) < numberValid.min) {
                  newVal = numberValid.min.toString();
                }
              }
            } else {
              newVal = '';
            }
          }
          }
          self.attrOptions.defaultValue = newVal;
          self.$emit('listenData', self.attrContent.name, value);
        },
        focus: (e: any) => {
          self.$emit('focus', e);
        },
        blur: (e: any) => {
          const numberValid: any = self.attrContent.options.regexps.numberValid;
          if (!e.target.value && numberValid) {
            self.attrOptions.defaultValue = numberValid.min;
          }
          self.$emit('blur', e);
        }
      },
      props: {
        required: false,
        title: self.attrContent.label,
        value: self.attrOptions.defaultValue,
        placeholder: self.attrContent.placeholder
          ? self.attrContent.placeholder
          : '请输入',
        type: 'text'
      }
    };
    return h('l-field', options);
  }

  // 开关
  booleanRender(h: any): any {
    const self = this;
    const options: RenderType = {
      props: {
        list: self.attrContent.list,
        attrOptions: self.attrOptions
      },
      on: {
        click: (values: object) => {
          self.$emit('listenData', 'boolean', values);
        }
      }
    };
    return h('check', options);
  }

  // 关联表单
  TreeRender(h: any): any {
    const self = this;
    let defaultValue = null;
    if (self.attrOptions.defaultValue) {
      const codeItem = self.attributes.find(
        a => a.attrContent.name === 'BOSchemaCode'
      );
      const parsed = JSON.parse(self.attrOptions.defaultValue);
      if (codeItem.attrOptions.defaultValue) {
        parsed.BOSchemaCode = codeItem.attrOptions.defaultValue;
        defaultValue = parsed;
      }
    }
    const options: RenderType = {
      props: {
        list: self.attrContent.list,
        attrOptions: self.attrOptions,
        defaultValue
      },
      on: {
        click: (
          values: {
            BOSchemaInfo: string;
            BOSchemaCode: string;
            BOSchemaName: string;
          } = {
            BOSchemaInfo: '',
            BOSchemaCode: '',
            BOSchemaName: ''
          }
        ) => {
          self.$emit('listenData', self.attrContent.name, values);
        }
      }
    };
    return h('association', options);
  }

  render(h: any) {
    let render: any = null;
    switch ((this.attrContent as any).type) {
      case AttributeType.CheckboxGroup:
        render = this.verifyRender(h);
        break;
      case AttributeType.Boolean:
        render = this.booleanRender(h);
        break;
      case AttributeType.Mode:
        render = this.modeRender(h);
        break;
      case AttributeType.RadioOption:
        render = this.radioRender(h);
        break;
      case AttributeType.Select:
        render = this.selectRender(h);
        break;
      case AttributeType.String:
        render = this.stringRender(h);
        break;
      case AttributeType.UserOrg:
        render = this.userOrgRender(h);
        break;
      case AttributeType.Tree:
        render = this.TreeRender(h);
        break;
      default:
        break;
    }
    return render;
  }
}
</script>

<style lang='less' scoped>
</style>
