import { Vue, Component, Prop } from 'vue-property-decorator';
import { VNode, CreateElement } from 'vue';

/* eslint-disable max-len */

const controlMap: {
  [controlKey: string]: Function;
} = {
  FormTextBox: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-text-box.vue'),
  FormRadioButtonList: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-radio-button-list.vue'),
  FormDropDownList: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-drop-down-list.vue'),
  FormCheckboxList: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-checkbox-list.vue'),
  FormNumber: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-number.vue'),
  FormFormula: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-formula.vue'),
  FormTextArea: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-text-area.vue'),
  FormDateTime: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-date-time.vue'),
  FormCheckbox: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-checkbox.vue'),
  FormUser: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-user.vue'),
  FormMultiUser: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-multi-user.vue'),
  FormAttachment: () => import(/* webpackChunkName: "uploadControls" */ '../common-controls/form-attachment.vue'),
  FormPhoto: () => import(/* webpackChunkName: "uploadControls" */ '../common-controls/form-photo.vue'),
  FormQuery: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-query.vue'),
  FormMultiQuery: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-multi-query.vue'),
  FormAreaSelect: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-area-select.vue'),
  FormButton: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-button.vue'),
  FormMap: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-map.vue'),
  FormGridView: () => import(/* webpackChunkName: "commonControls" */ '../layout-controls/form-grid-view.vue'),
  FormLabel: () => import(/* webpackChunkName: "commonControls" */ '../system-controls/form-label.vue'),
  FormSeqNo: () => import(/* webpackChunkName: "commonControls" */ '../system-controls/form-seq-no.vue'),
  FormTitle: () => import(/* webpackChunkName: "commonControls" */ '../common-controls/form-title.vue'),
};
controlMap.FormDescription = controlMap.FormTitle;

@Component
export default class FormWrapper extends Vue {
  @Prop()
  bizObjectId!: string;

  @Prop()
  lightAppPreview!: boolean;

  @Prop()
  lightAppData!:any;

  @Prop()
  newform!:object;

  render (h: CreateElement): VNode {
    // 增加表单设计器预览功能，数据由设计器属性提供
    let form = null;
    if (this.newform && Object.keys(this.newform).length) form = this.newform;
    else form = this.$store.state.Form.ViewModel[this.bizObjectId];
    const renderControls = form ? form.$renderControls : [];
    const children: VNode[] = [];
    let titleContainer: VNode[]|null = null;
    let titleCollapse = false; // 表示当前的FormTitle是否折叠，折叠状态下面的控件不可见
    let titleVisible = false;
    let titleField: string = '';
    const len = renderControls.length;
    for (let i = 0; i < len; i++) {
      const node = renderControls[i];
      const { controlKey, dataField } = node;
      if (controlKey === undefined) {
        continue;
      }
      const namespace = `${this.bizObjectId}/${dataField}`;
      const controlData = form[dataField];
      const basePropsData = {
        props: { dataField, namespace, control: controlData },
        key: namespace,
      };
      let control;
      // 给control进行map赋值
      if (controlMap[controlKey]) {
        control = h(controlMap[controlKey], basePropsData);
      } else {
        control = null;
      }

      if (controlKey === 'FormTitle') {
        // 当前是FormTitle，如果titleContainer存在，说明存在上一个title
        // titleContainer是两个title中间的控件，放在1个div内渲染
        if (titleContainer) {
          // 把form控件放到该div中
          children.push(h('div', {
            style: { display: titleCollapse || !titleVisible ? 'none' : '' },
          }, titleContainer));
          form[titleField].visible = titleVisible;
        }
        titleField = dataField;
        titleVisible = false;
        titleCollapse = !controlData.expanded;
        titleContainer = [];
        children.push(control);
      } else if (titleContainer) {
        // 当前不是FormTitle，titleContainer存在，则当前控件属于上一个title
        // 根据控件的visible，如果有一个控件可见，则其title可见
        if (controlData.visible) {
          titleVisible = true;
        }
        titleContainer.push(control);
      } else {
        // 当前控件不属于任何FormTitle
        children.push(control);
      }
      if (i === len - 1 && titleContainer) {
        form[titleField].visible = titleVisible;
        children.push(h('div', {
          style: { display: titleCollapse || !titleVisible ? 'none' : '' },
        }, titleContainer));
      }
    }
    return h('div', {}, [children, this.$slots.stamp]);
  }

  get context () {
    return this.$store.state.Form.ViewModel[this.bizObjectId];
  }

  get form () {
    return this.context;
  }
}
