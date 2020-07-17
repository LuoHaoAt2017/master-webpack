<template>
  <layout :title="title">
    <div class="app-pages preview-wrapper" id="form-page">
      <form-wrapper
        :lightAppPreview="true"
        :lightAppData="form"
        :bizObjectId="bizObjectId"
      ></form-wrapper>
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
import { FormControlType } from '@/light-app/config/form-control-type';
import {
  DefaultValue,
  DefaultControlValue
} from './defaultValue';
import FormWrapper from '@/components/form/shared/form-wrapper';
import cloneDeep from 'lodash/cloneDeep';
import { add, destory } from '.';
const LightApp = namespace('LightApp');
@Component({
  name: 'FormPreview',
  components: {
    FormWrapper
  }
})
export default class FormPreview extends Vue {
  title: string = '预览';
  @LightApp.State('formControls') formControls;
  @LightApp.State('formName') formName;
  @LightApp.State('isWorkflow') isWorkflow;
  @Mutation('excludeComp') excludeComp;

  // form需要一个ObjectId, 在未保存的情况下, 前端无ObjectId, 因此自造
  bizObjectId: string = `light-app-preview-${Math.random()* 10000 + 10000}`;

  form: any = null;
  created() {
    this.title = this.formName;
    this.handleFormFormat();
  }

  handleFormFormat() {
    let  ReturnData = this.controlLoop(
      cloneDeep(this.formControls)
    );
    this.form = {
      BizObjectId: this.bizObjectId,
      ReturnData: cloneDeep( ReturnData ),
      IsCreateMode: true,
      IsMobile: true,
      LightAppPreview: true
    };
    add(this.$store, {
      objectId: this.bizObjectId,
      context: cloneDeep(this.form),
      htmlData: JSON.stringify(this.formControls)
    });
  }
  
  /**
   * 转化数据格式
   */
  controlLoop(data) {
    let $renderControls = [];
    let controls = {};
    let ReturnData = {};
    let options: any = {};
    data.forEach(control => {
      options = Object.assign({}, cloneDeep(DefaultValue), cloneDeep(control.Options));
      options.Value = cloneDeep(options.DefaultValue);
      // 去除流程
      // options.Required = this.isWorkflow ? false : options.Required;

      // 清除旧数据的Required状态
      options.Required = false;
      if (control.Type !== FormControlType.FormGridView) {
        if (options.Permission > -1) {
          options.Visible = true;
        }
        if (options.Permission > 0) {
          options.Editable = true;
        }
        if (options.Permission > 1) {
          options.Required = true;
        }
      } else {
        options.Visible = true;
        options.Editable = true;
      }

      const type = FormControlType[control.Type];
      if (DefaultControlValue[type]) {
        options = {
          ...options,
          ...cloneDeep(DefaultControlValue[type].options)
        };
      }
      if(type === 'FormDropDownList') {
        options.Value = options.DefaultValue[0];
      }
      if (control.ChildControls && control.ChildControls.length > 0) {
        const childReturn = this.controlLoop(
          cloneDeep(control.ChildControls)
        );
        if(!options.ControlKey) {
          options.ControlKey = 'FormGridView';
        }
         

        options.Value = {
          R: [],
          T: cloneDeep(childReturn)
        }
      }
    options.LightAppPreview = true;
    ReturnData[control.Key] = { ...options };
    });
    return  ReturnData;
  }

  beforeRouteLeave(to, from, next) {
    destory(this.$store, this.bizObjectId);
    this.excludeComp(['FormPreview']);
    next();
  }
}
</script>

<style lang='less' scoped>
@import '~@/light-app/styles/light-app.less';
.preview-wrapper {
  background: #fff;
}
</style>
