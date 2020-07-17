<template>
  <layout
    title="编辑名称"
    :leftOptions="{ preventGoBack: true }"
    @on-click-back="goBack"
  >
    <div class="app-pages">
      <div class="form-edit-name__content">
        <l-field
          ref="field"
          title="数据表名称"
          v-model="formInfo.formName"
          type="textarea"
          :maxLength="32"
          :id="fieldID"
          @focus="setCss()"
        ></l-field>
      </div>
      <div class="form-edit-name__btn">
        <button
          class="btn-reset"
          @click="handleOk"
        >确 定</button>
      </div>
    </div>
    <validate-panel></validate-panel>
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
import { renameLightSheet } from '@/light-app/service';
import {
  LightAppActionType,
  LightAppMutationType
} from '@/light-app/store/types';
import { FormActionType } from '@/store/modules/form/types';
import { AppMutationType, AppActionType } from '@/store/modules/app/types';
import ValidatePanel from '@/components/form/shared/validate-panel.vue';
// vuex-class module命名空间
const FormModule = namespace('Form');
const lightAppModule = namespace('LightApp');
const appModule = namespace('App');
@Component({
  name: 'FormNameEdit',
  components: {
    LField,
    ValidatePanel
  },
  filters: {}
})
export default class FormNameEdit extends Vue {
  formInfo: any = {
    formName: '',
    formCode: '',
    appCode: '',
    formStatus: ''
  };
  isSubSheet: boolean = false;
  @appModule.State('renameSheetIndex') renameSheetIndex;
  @lightAppModule.State('formName') formName;
  @lightAppModule.State('subFormName') subFormName;
  @lightAppModule.State('colsNameList') colsNameList;
  @lightAppModule.Action(LightAppActionType.RenameSheet) renameSheet;
  @lightAppModule.Mutation(LightAppMutationType.UpdateFormName) updateFormName;
  @appModule.Mutation(AppMutationType.HandleUpdataSheets) handleUpdataSheets;
  @FormModule.Action(FormActionType.SHOWVALIDMSG)
  showValidMsg;
  @lightAppModule.Mutation(LightAppMutationType.UpdateColsNameList)
  updateColsNameList;
  @Mutation('excludeComp') excludeComp;

  $refs: {
    field: any;
  };
  oldFormName: string = '';
  fieldID: string = 'textarea-edit';
  created() {
    const query = this.$route.query;
    this.isSubSheet = query.subSheet === 'true' ? true : false;
    const name = this.isSubSheet ? this.subFormName : this.formName;
    // 如果是默认表单名称则要清除input内容
    this.oldFormName = name;
    this.formInfo.formName = name === '未命名的数据表' ? '' : name;
    this.formInfo = Object.assign({}, this.formInfo, query);
  }
  mounted() {
    this.$refs.field.autofocus();
  }
  checkValue(): boolean {
    const checkInput = /^[\s]{0,}$/.test(this.formInfo.formName);
    return !checkInput;
  }
  handleOk() {
    if (this.checkValue()) {
      // 表单设计页的编辑表单
      if (this.formInfo.formStatus) {
        this.updateFormName({
          name: this.formInfo.formName,
          subSheet: this.isSubSheet
        });
        if (this.isSubSheet) {
          if (
            this.oldFormName !== this.formInfo.formName &&
            this.colsNameList.includes(this.formInfo.formName)
          ) {
            this.showValidMsg(`明细表名称【${this.formInfo.formName}】已存在`);
            return;
          } else {
            this.updateColsNameList({
              name: this.formInfo.formName,
              subSheet: true
            });
          }
          this.$router.replace({
            name: 'lightFormSubSheetDesignPage',
            query: this.formInfo
          });
        } else {
          this.$router.replace({
            name: 'lightFormDesignPage',
            query: this.formInfo
          });
        }
        return false;
      } else {
        this.saveEditName();
      }
    } else {
      this.showValidMsg('请输入数据表名称');
    }
  }

  beforeRouteLeave(to, from, next) {
    this.excludeComp(['FormNameEdit']);
    next();
  }
  async saveEditName() {
    const res = await renameLightSheet({
      displayName: this.formInfo.formName,
      code: this.$route.query.sheetCode,
      appCode: this.$route.query.appCode
    });
    if (res.success) {
      this.handleUpdataSheets({
        renameSheetIndex: this.$route.query.index,
        disPlayName: this.formInfo.formName
      });
      this.$h3.toast.show({ text: '修改成功', duration: 1500 });
      this.$router.replace({
        name: 'schemas',
        query: this.formInfo
      });
    }
  }
  cancelGoBack() {
    this.$router.go(-1);
  }
  goBack() {
    //表单设计页的编辑表单
    if (this.formInfo.formStatus) {
      if (this.isSubSheet) {
        this.$router.replace({
          name: 'lightFormSubSheetDesignPage',
          query: this.formInfo
        });
      } else {
        this.$router.replace({
          name: 'lightFormDesignPage',
          query: this.formInfo
        });
      }
      return false;
    }
    if (this.checkValue()) {
      if (this.oldFormName !== this.formInfo.formName) {
        this.$h3.modal.show({
          content: '是否保存当前数据表名称',
          type: 'alert',
          actions: [
            {
              text: '不保存',
              onPress: () => {
                this.cancelGoBack();
              }
            },
            {
              text: '保存',
              onPress: () => {
                this.saveEditName();
              }
            }
          ]
        });
      } else {
        this.cancelGoBack();
      }
    } else {
      this.cancelGoBack();
    }
  }
  //处理光标定位到文本最后
  setCss() {
    const sr: any = document.getElementById('textarea-edit');
    const len = sr.value.length;

    this.setSelectionRange(sr, len, len);
  }
  setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
      const range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  }
}
</script>
<style lang='less' scoped>
@import '~@/styles/form-base.less';
.form-edit-name {
  &__content {
    padding: 0.2667rem 0.48rem 0 0.48rem;
    background: #fff;
  }
  &__btn {
    .px2rem(margin, 30);
  }
}
</style>
