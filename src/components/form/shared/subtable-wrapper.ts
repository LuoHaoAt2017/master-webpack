import { Vue, Component, Prop } from 'vue-property-decorator';
import { VNode, CreateElement } from 'vue';

/* eslint-disable max-len */

const FormTextBox = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-text-box.vue');
const FormRadioButtonList = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-radio-button-list.vue');
const FormDropDownList = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-drop-down-list.vue');
const FormCheckboxList = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-checkbox-list.vue');
const FormNumber = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-number.vue');
const FormFormula = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-formula.vue');
const FormTextArea = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-text-area.vue');
const FormDateTime = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-date-time.vue');
const FormCheckbox = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-checkbox.vue');
const FormUser = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-user.vue');
const FormMultiUser = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-multi-user.vue');
const FormAttachment = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-attachment.vue');
const FormPhoto = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-photo.vue');
const FormQuery = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-query.vue');
const FormMultiQuery = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-multi-query.vue');
const FormAreaSelect = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-area-select.vue');
const FormButton = () => import(/* webpackChunkName: "formControls" */ '../common-controls/form-button.vue');

@Component
export default class SubTableWrapper extends Vue {
  @Prop()
  bizObjectId!: string;

  @Prop()
  dataField!: string;

  @Prop()
  rowId!: string;

  // 初始化改表单的所有组件
  render (h: CreateElement) {
    const children: VNode[] = [];
    const controls = this.$store.state.Form.ViewModel[this.bizObjectId][this.dataField].controls;
    if (controls) {
      const rowNamespace = `${this.bizObjectId}/${this.dataField}/${this.rowId}/`;
      for (const control of controls) {
        const { dataField, controlKey } = control;
        const namespace = rowNamespace + dataField;
        const basePropsData = {
          props: { dataField, namespace, isIngrid: true, control },
        };
        switch (controlKey) {
          case 'FormTextBox':
            children.push(h(FormTextBox, basePropsData));
            break;
          case 'FormCheckboxList':
            children.push(h(FormCheckboxList, basePropsData));
            break;
          case 'FormNumber':
            children.push(h(FormNumber, basePropsData));
            break;
          case 'FormFormula':
            children.push(h(FormFormula, basePropsData));
            break;
          case 'FormTextArea':
            children.push(h(FormTextArea, basePropsData));
            break;
          case 'FormDateTime':
            children.push(h(FormDateTime, basePropsData));
            break;
          case 'FormCheckbox':
            children.push(h(FormCheckbox, basePropsData));
            break;
          case 'FormUser':
            children.push(h(FormUser, basePropsData));
            break;
          case 'FormMultiUser':
            children.push(h(FormMultiUser, basePropsData));
            break;
          case 'FormAttachment':
            children.push(h(FormAttachment, basePropsData));
            break;
          case 'FormPhoto':
            children.push(h(FormPhoto, basePropsData));
            break;
          case 'FormQuery':
            children.push(h(FormQuery, basePropsData));
            break;
          case 'FormMultiQuery':
            children.push(h(FormMultiQuery, basePropsData));
            break;
          case 'FormAreaSelect':
            children.push(h(FormAreaSelect, basePropsData));
            break;
          case 'FormButton':
            children.push(h(FormButton, basePropsData));
            break;
          case 'FormDropDownList':
            children.push(h(FormDropDownList, basePropsData));
            break;
          case 'FormRadioButtonList':
            children.push(h(FormRadioButtonList, basePropsData));
            break;
          default:
            break;
        }
      }
    }
    return h('div', {}, children);
  }

  get form () {
    return this.$store.state.Form.ViewModel[this.bizObjectId];
  }

  get context () {
    return this.form[this.dataField][this.rowId];
  }
}
