<template>
  <layout
    :title="title"
    class="control-detail-wrapper"
  >
    <div
      class="app-pages"
      ref="scrollDom"
    >
      <div class="control-detail__content">
        <l-field
          class="input-name"
          v-model="attrValues.DisplayName"
          title="字段名称"
          type="textarea"
          @focus="handleFocus"
          @blur="handleBlur"
        ></l-field>
        <template v-for="(item,index) in controlAttrList">
          <div
            v-if="!item.attrContent.inVisible"
            :key="index"
            class="control-detail__set-formatter"
            :class="{
            'padd-auto': getPaddAuto(item.attrContent.type),
            'class-auto': getClassAuto(item.attrContent.name)
          }"
          >
            <control-attribute-value
              :attrOptions="item.attrOptions"
              :attrContent="item.attrContent"
              :attributes="controlAttrList"
              @listenData="handleAttrData"
              @focus="doFooterHide"
              @blur="doFooterShow"
            ></control-attribute-value>
          </div>
        </template>

      </div>

      <div
        class="control-detail__footer light-app-footer"
        v-show="footerShow"
      >
        <div class="control-detail__footer-tips">更多功能请在电脑端登录氚云进行设置</div>
        <div class="control-detail__footer-btn">
          <button
            class="btn-reset"
            @click="commitControl"
          >确 定</button>
        </div>
      </div>
      <validate-panel></validate-panel>
    </div>
  </layout>
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
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import { LField } from '@/light-app/components';
import { ControlDefaultValue } from './field-default-value';
import { AttributeType, ControlStatus } from '@/light-app/config/const';
import { autoRename, handleColsName } from '@/light-app/utils';
import { ControlAttrType } from './types.d';
import { FormActionType } from '@/store/modules/form/types';
import { createControlCode } from '@/light-app/utils';
import ValidatePanel from '@/components/form/shared/validate-panel.vue';
import cloneDeep from 'lodash/cloneDeep';
import ControlAttributeValue from './control-attribute-value.vue';
import {
  UniqueControls,
  ContorlTypeObject,
  FormControlType,
  SystemControlCodeType
} from '@/light-app/config/form-control-type';
import {
  LightAppActionType,
  LightAppMutationType
} from '@/light-app/store/types';
const FormModule = namespace('Form');
const LightApp = namespace('LightApp');
@Component({
  name: 'ControlDetail',
  components: {
    LField,
    ControlAttributeValue,
    ValidatePanel
  }
})
export default class ControlDetail extends Vue {
  title: string = '';
  controlKey: string = ''; // 编辑字段的key
  controlType: number = -1; // 字段类型
  controlTypeObject: H3.LightApp.TypeDefinition = null; // 字段类型的格式，验证数据
  isFirstFocus: boolean = true; // 进入字段属性创建时，默认值为字段名称，此时首次聚焦应直接清空
  controlAttrList: ControlAttrType[] = []; // 字段属性列表
  attrValues: H3.LightApp.ControlOptions = null; // 字段属性的值
  status: string = ''; //添加字段 or 编辑字段
  docmHeight: number = document.documentElement.clientHeight; // 默认屏幕高度
  showHeight: number = document.documentElement.clientHeight; // 实际屏幕高度
  footerShow: boolean = true; // 显示或者隐藏footer
  isSubSheet: boolean = false;
  oldName: string = '';
  @Mutation('excludeComp') excludeComp;

  @LightApp.State('formControls') formControls;
  @LightApp.State('uniqueControl') uniqueControl;
  @LightApp.State('colsNameList') colsNameList;
  @LightApp.State('subColsNameList') subColsNameList;
  @LightApp.State('subFormControls') subFormControls;
  @LightApp.State('isWorkflow') isWorkflow;
  @LightApp.State('controlCodeList') controlCodeList;
  @LightApp.Mutation(LightAppMutationType.UpdateControlCodeList)
  updateControlCodeList;
  @LightApp.Mutation(LightAppMutationType.UpdateFormControls)
  updateFormControls;
  @LightApp.Mutation(LightAppMutationType.SelectedControl)
  updateSelectedControl;
  @LightApp.Mutation(LightAppMutationType.HandleUniqueControls)
  handleUniqueControls;
  @LightApp.Mutation(LightAppMutationType.UpdateColsNameList)
  updateColsNameList;
  @FormModule.Action(FormActionType.SHOWVALIDMSG)
  showValidMsg;

  $refs: {
    scrollDom: any;
  };

  created() {
    const { key, type, status, subSheet } = this.$route.query as any;
    if (subSheet === 'true') {
      this.isSubSheet = true;
    }
    this.controlKey = key ? key : '';
    this.controlType = Number(type);
    this.status = status;
    this.controlTypeObject = ContorlTypeObject[this.controlType];
    this.title = this.controlTypeObject.name;
    this.getAttrDefaultValues();
    this.getControlAttrArr();
  }

  mounted() {
    window.addEventListener('resize', this.resize);
  }

  resize() {
    this.showHeight = document.body.clientHeight;
  }

  @Watch('showHeight')
  showHeightChange(newHeight) {
    if (this.docmHeight > newHeight) {
      this.doFooterHide();
    } else {
      this.doFooterShow();
    }
  }

  scrollHandler() {
    const newHeight = this.$refs.scrollDom.scrollHeight;
    if (newHeight > this.docmHeight) {
      this.$refs.scrollDom.scrollTop = newHeight;
    }
  }

  /**
   * 获取属性初始值
   */
  getAttrDefaultValues() {
    this.attrValues = cloneDeep(
      ControlDefaultValue[this.controlType].controlOptions
    );
    const sheetControlList = this.isSubSheet
      ? this.subFormControls
      : this.formControls;
    if (this.status === ControlStatus.Edit) {
      const attr = sheetControlList.find(item => item.Key === this.controlKey);
      this.attrValues = Object.assign({}, this.attrValues, cloneDeep(attr.Options));
      this.oldName = this.attrValues.DisplayName;
    } else {
      // 做不重名处理
      const nameList = this.isSubSheet
        ? this.subColsNameList
        : this.colsNameList;
      this.attrValues.DisplayName = autoRename(
        this.attrValues.DisplayName,
        handleColsName(nameList)
      );
    }
  }

  handleFocus() {
    this.doFooterHide();
    if (this.status !== ControlStatus.Edit && this.isFirstFocus) {
      this.isFirstFocus = false;
      this.attrValues.DisplayName = '';
    }
  }

  handleBlur() {
    this.doFooterShow();
  }

  doFooterShow() {
    this.footerShow = true;
  }

  doFooterHide() {
    this.footerShow = false;
  }

  /**
   * 对一些字段属性做特殊样式处理
   */
  getClassAuto(name) {
    const list = ['DecimalPlaces'];
    if (list.includes(name)) {
      return true;
    } else {
      return false;
    }
  }
  getPaddAuto(index) {
    const list = [AttributeType.Boolean, AttributeType.Select];
    if (list.includes(index)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 字段属性初始化
   */
  getControlAttrArr() {
    const booleanList = [];
    const booleanOptions = {};
    this.controlTypeObject.designProperties.forEach(attr => {
      const attribute = cloneDeep(attr);
      // 当前表单开启了流程设计后，所有的必填属性都不显示
      // if (this.isWorkflow && attribute.name === 'Required') {
      //   attribute.inVisible = true;
      // }
      if (attr.type === AttributeType.Boolean) {
        if (attr.name === 'HasWatermark' && this.attrValues['CameraOnly']) {
          attribute.inVisible = false;
        }
        booleanList.push(attribute);
        booleanOptions[attribute.name] = this.attrValues[attribute.name];
      } else {
        // 当选择小数位时，小数输入框应该可以显示
        if (
          attr.name === 'NumberFormat' &&
          this.attrValues['DecimalPlaces'] > -1
        ) {
          this.attrValues.NumberFormat = 1;
        }
        if (
          attr.name === 'DecimalPlaces' &&
          this.attrValues['DecimalPlaces'] > -1
        ) {
          attribute.inVisible = false;
        }
        let defaultValue = this.attrValues[attribute.name];
        if (attr.type === AttributeType.Select) {
          defaultValue = this.attrValues.DefaultValue;
        }
        if (attr.name === 'NumberFormat') {
          defaultValue = this.attrValues['DecimalPlaces'] > -1 ? 1 : 0;
        }

        const curAttr = {
          attrOptions: {
            defaultValue: defaultValue,
            defaultItems: this.attrValues.DefaultItems,
            type: this.controlType
          },
          attrContent: attribute
        };
        this.controlAttrList.push(curAttr);
      }
    });

    // boolean类型的专门处理
    const attrContent = {
      list: booleanList,
      type: AttributeType.Boolean,
      name: 'boolean'
    };
    this.controlAttrList.push({
      attrContent,
      attrOptions: booleanOptions
    });
  }

  /**
   * 字段属性值更新
   */
  handleAttrData(type, value) {
    const self = this;
    const obj = {
      NumberFormat: () => {
        // value：1表示小数，0表示整数
        // 数字字段选择小数时需要填写小数位数，选择整数时则隐藏小数位数框，小数位数框通过inVisible显示
        const index = self.controlAttrList.findIndex(
          item => item.attrContent.name === 'DecimalPlaces'
        );
        self.controlAttrList[index].attrContent.inVisible =
          value === 1 ? false : true;
        if (value === 0) {
          self.attrValues['DecimalPlaces'] = -1;
        } else {
          self.controlAttrList[index].attrOptions.defaultValue = 0;
          self.attrValues['DecimalPlaces'] = 0;
        }
      },
      DecimalPlaces: () => {
        self.attrValues[type] = !value ? 0 : Number(value);
      },
      boolean: () => {
        const list = { ...value };
        Object.keys(list).forEach(key => {
          if (key === 'ShowMode') {
            list[key] = list[key] ? '1' : '0';
          }
          // 图片选择拍照上传时显示水印
          if (key === 'CameraOnly') {
            const booleanIndex = self.controlAttrList.findIndex(
              item => item.attrContent.name === 'boolean'
            );
            const booleanList = self.controlAttrList[booleanIndex].attrContent
              .list as any;
            const index = booleanList.findIndex(
              item => item.name === 'HasWatermark'
            );
            booleanList[index].inVisible = list[key] ? false : true;
          }
        });
        self.attrValues = Object.assign({}, self.attrValues, list);
      },
      SelectionRanges: () => {
        const list = [...value];
        let selectionRanges = {},
          selectionRangeIds = [];
        list.forEach(item => {
          selectionRanges[item.id] = item.name;
          selectionRangeIds.push(item.id);
        });
        self.attrValues[type] = selectionRanges;
        self.attrValues['UnitSelectionRange'] = selectionRangeIds.join(';');
      },
      BOSchemaInfo: () => {
        if (!value.BOSchemaCode || value.BOSchemaCode !== self.attrValues.BOSchemaCode) {
          self.attrValues.AssociationFilter = '';
          self.attrValues.MappingControls = '';
        }
        for (const key in value) {
          if (value.hasOwnProperty(key)) {
            const item = value[key];
            self.attrValues[key] = item;
          }
        }
      },
      DefaultItems: () => {
        if (value.status && value.status === 'add') {
          self.scrollHandler();
        }
        self.attrValues[type] = value.curList;
      }
    };
    if (obj.hasOwnProperty(type)) {
      obj[type]();
    } else {
      this.attrValues[type] = value;
    }
  }

  commitControl() {
    if (!this.attrValues.DisplayName) {
      this.showValidMsg('请输入字段名称');
      return;
    }
    if (
      this.controlType === FormControlType.FormQuery &&
      !this.attrValues.BOSchemaInfo
    ) {
      this.showValidMsg('请选择关联表单');
      return;
    }
    const nameList = this.isSubSheet ? this.subColsNameList : this.colsNameList;
    if (nameList.includes(this.attrValues.DisplayName)) {
      if (
        !(
          this.status === ControlStatus.Edit &&
          this.attrValues.DisplayName === this.oldName
        )
      ) {
        this.showValidMsg(`字段名称【${this.attrValues.DisplayName}】已存在`);
        return;
      }
    }

    // 字段为下拉框和复选框时，至少要有一项选项值，且需清除为空值的选项值，不要有重复的选项值
    const isSelect =
      this.controlType === FormControlType.FormCheckboxList ||
      this.controlType === FormControlType.FormDropDownList;
    if (isSelect) {
      let defaultItems = [...this.attrValues.DefaultItems];
      defaultItems = defaultItems.filter(item => !!item);
      if (defaultItems.length === 0) {
        this.showValidMsg('最少要有一项有效的选项值');
        return;
      } else {
        if (new Set(defaultItems).size < defaultItems.length) {
          this.$h3.toast.hide();
          this.$h3.toast.show({ text: '有重复选项值' });
          return;
        }
        this.attrValues.DefaultItems = defaultItems;
      }
    }
    let newKey = this.controlKey;

    // 推入新的唯一字段
    if (UniqueControls.includes(Number(this.controlType))) {
      this.handleUniqueControls({
        status: 'add',
        control: Number(this.controlType)
      });
    }
    // 数字字段去除NumberFormat
    if (this.attrValues.NumberFormat) {
      delete this.attrValues.NumberFormat;
    }
    // 为新增状态时，需要获取新的字段Key值
    if (this.status !== ControlStatus.Edit) {
      if (SystemControlCodeType[this.controlType]) {
        newKey = SystemControlCodeType[this.controlType];
        this.attrValues.DataField = newKey;
      } else {
        const key = createControlCode(this.controlCodeList);
        this.attrValues.DataField = key;
        newKey = key;
      }
    }
    
    const control = {
      Key: newKey,
      ParentKey: '',
      Options: cloneDeep(this.attrValues),
      Type: this.controlType,
      ChildControls: []
    };
    this.updateFormControls({
      control,
      status: this.status,
      subSheet: this.isSubSheet
    });
    this.updateSelectedControl({ code: newKey, subSheet: this.isSubSheet });
    this.updateColsNameList({ status: 'reset', subSheet: this.isSubSheet });
    this.updateControlCodeList({ key: newKey });
    this.$nextTick(() => {
      this.$router.replace({
        name: this.isSubSheet
          ? 'lightFormSubSheetDesignPage'
          : 'lightFormDesignPage'
      });
    });
  }

  beforeRouteLeave(to, from, next) {
    this.attrValues = null;
    window.removeEventListener('resize', this.resize);
    this.excludeComp(['ControlDetail']);
    next();
  }
}
</script>

<style lang='less' scoped>
@import '~@/light-app/styles/light-app.less';
.app-pages {
  background-color: #f5f7f9;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.control-detail {
  &-wrapper {
    .icon-control-list {
      display: flex;
      flex-wrap: wrap;
    }
    .input-name {
      padding: 0.32rem 0.3733rem 0 0.3733rem;
      background: #fff;
    }
    .min-height {
      .px2rem(min-height, 1036);
    }
  }
  &__input {
    padding: 0 0.4533rem;
    background: #fff;
  }
  &__set-formatter {
    .px2rem(margin-top, 20);
    background: #fff;
    &.padd-auto {
      .px2rem(padding-top, 20);
      .px2rem(padding-bottom, 36);
      .px2rem(padding-left, 30);
      .px2rem(padding-right, 30);
    }
    &.class-auto {
      margin-top: 0;
      padding-top: 0;
      .px2rem(padding-bottom, 4);
    }
  }
  &__content {
    .px2rem(margin-bottom, 220);
  }

  &__footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    &-tips {
      .px2rem(fonz-size, 26);
      .px2rem(margin-bottom, 22);
      .px2rem(margin-top, 22);
      color: #999;
      text-align: center;
    }
    &-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      .px2rem(border-radius, 10);
      .px2rem(height, 88);
      .px2rem(font-size, 30);
      margin: 0 0.6667rem 0.4rem 0.6667rem;
      background: @lightAppPrimaryColor;
    }
    .btn {
      width: 100%;
      height: 100%;
      border: 0;
      color: #fff;
      background: transparent;
    }
  }
}
</style>
