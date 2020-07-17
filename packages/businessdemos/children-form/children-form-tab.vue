<template>
  <div class="subform-container">
    <h3-tab-subform :apps="apps" v-model="selectedIndex"
      @onPlusClick="onPlusClick" ref="subFormtab">
      <div class="main-content">
        <div v-for="(item, index) in apps" :key="index" v-if="index === selectedIndex">
          <!--内部组件-->
          <h3-input :required="true" :onChange="onChangeInput(item.value1,item)" :class="{'has-mistake': item.mistake1}" title="产品名称" tip="产品名称" v-model="item.value1" ref="h3input2" @onBlur="cancelFocus2" placeholder="请输入" :clear="true" type="text"></h3-input> 
          
          <div class="switch-content" :class="{'has-mistake': item.mistake2}">
            <span>启用规格</span>
            <h3-switch v-model="item.value2" color="#1890FF"></h3-switch>
          </div>

          <!-- <div :class="{'has-mistake': item.mistake3}">
            <h3-list-item :touchFeedback="false">
              <h3-popup-picker  title="产品规格" :data="['我是产品规格的具体指'.split('')]" v-model="item.value3"></h3-popup-picker>
            </h3-list-item>
          </div> -->

          <div :class="{'has-mistake': item.mistake4}">
            <h3-input title="日期" :value="item.value4" :editable="false" placeholder="请选择日期" @click.native="setDate(item)">
              <div class="datetime-right-icon" >
                <i class="icon aufont icon-base-right datetime-icon"></i>
              </div>
            </h3-input>
          </div>
          
          <div :class="{'has-mistake': item.mistake5}">
            <h3-multiuser title="多人多部门选择（编辑状态）" 
              objectId="hyisdckkiseed"  
              :initSelectedItem="item.initSelectedItem"
              :initSelectedOrgItem="item.initSelectedOrgItem"
              :initSelectedUserItem="item.initSelectedUserItem"
              :required="false" 
              dataField="muser0"
              :readonly="false"
              :userVisible="true"
              :orgUnitVisible="true" >
            </h3-multiuser>
          </div>

          <div class="remark-upload-file-wrapper" :class="{'has-mistake': item.mistake6}">
            <H3PhotoField
              :multiple="true"
              :corpId="corpId"
              :url="url"
              :readOnly="false"
              :max="3"
              :maxUpload="8"
              :columns="4"
              layout="h"
              :autoPending="false"
              name="图片"
              :photoList="item.photoList"
              labelCls="h3-remark-photo-upload-label"
              :required="true"
              icon="icon aufont icon-base-picture"
              placeholderIcon="icon aufont icon-base-question-circle-o"
              delIcon="icon aufont icon-base-close-circle"
              delIconClsName="remark-upload-item-delicon"
              fieldPlaceholderCls="h3-remark-field-place-holder"
              @uploadError="uploadError"
              :onDelete="onPhotoDelete"
              :onChange="onPhotoChange"
              :onImagePreview="onImagePreview"
              placeholder="请上传图片">
            </H3PhotoField>
          </div>

          <div class="remark-upload-file-wrapper" :class="{'has-mistake': item.mistake7}">
            <h3-file-field
              :multiple="true"
              :corpId="corpId"
              :url="url"
              :readOnly="false"
              :fileList="item.fileList"
              name="附件"
              labelCls="h3-remark-photo-upload-label" 
              fieldPlaceholderCls="h3-remark-field-place-holder"
              placeholderIcon="icon aufont icon-base-question-circle-o"
              icon="icon aufont icon-base-paperclip"
              iconClsName="h3-remark-photo-upload-picture-icon"
              :onDelete="onFileDelete"
              :onChange="onFileChange"
              :required="true">
            </h3-file-field>
          </div>
        </div>
      </div>
    </h3-tab-subform>
    <div class="form-footer-btn">
      <h3-button-group :button-group="buttonGroup" borderType="center-border" ></h3-button-group>
    </div>
  </div>
</template>

<script>
import H3TabSubform from '../../widgets/h3-tab/h3-tab-subform';
import H3List from '../../components/h3-list/h3-list';
import H3ListItem from '../../components/h3-list/h3-list-item';
import H3Input from '../../components/h3-input/h3-input';
import H3Cell from '../../components/h3-cell';
import H3PopupPicker from '../../components/h3-popup-picker';
import H3Switch from '../../components/h3-switch';
import H3Group from '../../components/h3-group';
import H3ButtonGroup from '../../widgets/h3-button/h3-button-group2';
import H3Multiuser from '../../components/h3-organization/h3-multiuser';
import H3PhotoField from '../../components/h3-photofield/index';
import H3FileField from '../../components/h3-file/index';
import { setTitle, setLeft } from '../../libs/dingtalk-interface';
import H3Toast from '../../components/h3-toast/';


export default {
  name: 'h3-children-form-tab',
  components: {
    H3TabSubform,
    H3List,
    H3ListItem,
    H3Input,
    H3Cell,
    H3PopupPicker,
    H3Switch,
    H3Group,
    H3ButtonGroup,
    H3Multiuser,
    H3PhotoField,
    H3FileField,
    H3Toast,
  },
  data() {
    return {
      apps: [
        {
          value1: '',
          value2: false,
          value3: [],
          value4: '',
          value5: '',
          mistake1: true,
          mistake2: false,
          mistake3: true,
          mistake4: false,
          mistake5: true,
          mistake6: false,
          mistake7: true,
          initSelectedItem: [{
            DisplayName: '奥哲科技',
            IsSelected: true,
            ObjectId: 'C1',
            Type: 2,
            UnitID: 'C1',
            UserCount: 100,
          }],
          initSelectedOrgItem: [],
          initSelectedUserItem: [],
          photoList: [],
          fileList: [],
        },
        {
          value1: '',
          value2: false,
          value3: [],
          value4: '',
          value5: '',
          photoList: [],
          fileList: [],
          mistake: true,
          mistake1: false,
          mistake2: true,
          mistake3: false,
          mistake4: true,
          mistake5: false,
          mistake6: true,
          mistake7: false,
        },
        {
          value1: '',
          value2: false,
          value3: [],
          value4: '',
          value5: '',
          photoList: [],
          fileList: [],
        },
        {
          value1: '',
          value2: false,
          value3: [],
          value4: '',
          value5: '',
          photoList: [],
          fileList: [],
        },
        {
          value1: '',
          value2: false,
          value3: [],
          value4: '',
          value5: '',
          photoList: [],
          fileList: [],
        },
        {
          value1: '',
          value2: false,
          value3: [],
          value4: '',
          value5: '',
          photoList: [],
          fileList: [],
        },
        {
          value1: '',
          value2: false,
          value3: [],
          value4: '',
          value5: '',
          photoList: [],
          fileList: [],
        },
        {
          value1: '',
          value2: false,
          value3: [],
          value4: '',
          value5: '',
          photoList: [],
          fileList: [],
        },
        {
          value1: '',
          value2: false,
          value3: [],
          value4: '',
          value5: '',
          photoList: [],
          fileList: [],
        },
      ],
      buttonGroup: [
        {
          title: '删除',
          type: 'share',
          size: 'lg',
          onClick: this.delectForm,
        },
        {
          title: '复制',
          type: 'share',
          size: 'lg',
          onClick: this.copyForm,
        },
        {
          title: '保存',
          type: 'share',
          size: 'lg',
          onClick: this.saveForm,
        },
        {
          title: '保存并返回',
          type: 'share',
          size: 'lg',
          onClick: this.saveFormAndReturn,
        },
      ],
      selectedIndex: 0,
      focus2: false,
      defaultValue: '',
      list1: ['小米', 'iPhone', '华为', '情怀', '三星', '其他', '不告诉你'],
      photoList: [],
      fileList: [],
      corpId: '',
      url: '',
      confirmData: [],
      confirmDelect: false,
      customActions: [
        {
          text: '取消',
          onPress() {
            return ;
          },
        },
        {
          text: '确定',
          onPress: () => {
            this.delectModel();
          },
        },
      ],
      customActions2: [
        {
          text: '取消',
          onPress() {
            return ;
          },
        },
        {
          text: '不保存',
          onPress: () => {
            this.withoutSaveReturn();
          },
        },
      ],
      tempData: false,
    };
  },
  created() {
  },
  mounted() {
    this.$watch('apps', () => {
      this.tempData = true;
    }, { deep: true });
  },
  activated() {
    setTitle('字表编辑');

    const self = this;
    window.backFn = function backFn() {
      if (!self.tempData) {
        self.goBack();
      } else {
        this.$h3.modal.show({
          title: '确认返回吗？',
          type: 'alert',
          content: '您还有内容未保存,确认返回将丢失内容',
          actions: this.customActions2,
        });
      }
    };
    setLeft(window.backFn);
  },
  methods: {
    delectForm() {
      // 删除该条子表明细
      if (this.apps.length === 1 && !this.confirmDelect) {
        this.$h3.modal.show({
          title: '确认删除吗？',
          type: 'alert',
          content: '这已是最后一条数据，删除后返回',
          actions: this.customActions,
        });
      } else {
        this.apps.splice(this.selectedIndex, 1);
      }
      if (this.selectedIndex === this.apps.length) {
        this.selectedIndex = this.apps.length - 1;
      }
      if (this.apps.length === 0) {
        console.log('删光了~');
      }
    },
    copyForm() {
      // 复制该条子表明细
      this.apps.splice(this.selectedIndex, 0, this.apps[this.selectedIndex]);
    },
    saveForm() {
      // 深拷贝
      this.confirmData = [].concat(JSON.parse(JSON.stringify(this.apps)));
      this.tempData = false;
      window.toast.show({
        text: '保存成功！',
        iconType: 'success',
        duration: 1000,
        mask: true,
      });
      console.log('保存成功');
      // console.log(this.confirmData);
      // console.log(this.tempData);
    },
    saveFormAndReturn() {
      this.confirmData = this.apps;
      this.tempData = false;
      this.$router.push({
        name: 'editChildrenForm',
        params: {
          formDetails: this.confirmData,
        },
      });
      // if (this.tempData) {
      //   alert('有没保存的内容');
      // } else {
      //   alert('无差异');
      // }
    },
    withoutSaveReturn() {
      this.$router.push({
        name: 'editChildrenForm',
        params: {
          formDetails: this.confirmData,
        },
      });
    },
    onToggle() {
      if (this.toggle) {
        this.toggle();
      } else {
        this.$emit('toggle');
      }
    },
    onPlusClick() {
      this.apps.push({});
      this.selectedIndex = this.apps.length - 1;
    },
    setFocus2() {
      const that = this;
      setTimeout(function() {
        that.$refs.h3input2.selfFocus();
      }, 1);
    },
    cancelFocus2() {
      this.focus2 = false;
    },
    setDate(item) {
      this.target = item.value4;
      let val = item.value4 || this.defaultValue;
      let format1 = 'YYYY-MM-DD';
      const self = this;
      this.$h3.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        clearText: '清除',
        format: format1,
        value: val,
        onConfirm(value) {
          // self.target = value;
          item.value4 = value;
        },
        onShow() {
        },
        onHide() {
        },
        onClear() {
          item.value4 = '';
        },
      });
    },
    onClickSubmit() {
      // window.history.go(-1);
      this.toastShow = true;
      const remarkObj = {
        text: this.textareaValue,
        imgs: this.photoList,
        files: this.fileList,
      };
      setTimeout(() => {
        this.$router.push({
        // path: '/formInfoIndex',
          path: this.routerFrom,
          params: {
            remark: remarkObj,
          },
        });
      }, 2000);
    },
    onPhotoDelete(index) {
      this.photoList = this.photoList.filter((item, i) =>
        index !== i) || [];
    },
    onPhotoChange(fieldData, newPhotoList) {
      this.photoList = newPhotoList;
    },
    onImagePreview(index) {
      console.log(index);
      if (this.corpId) {
        // 调用钉钉接口
      }
    },
    onFileDelete(index) {
      this.fileList = this.fileList.filter((item, i) =>
        index !== i) || [];
    },
    onFileChange(fieldData, newfileList) {
      this.fileList = newfileList;
    },
    uploadError() {
      this.toastUploadImgShow = true;
      setTimeout(() => {
        this.toastUploadImgShow = false;
      }, 2000);
    },
    delectModel() {
      this.confirmDelect = true;
      this.delectForm(this.selectedIndex);
    },
    onChangeInput(val, item) {
      if (val === '') {
        this.$set(item, 'mistake1', true);
      } else {
        this.$set(item, 'mistake1', false);
      }
    },
  },
  watch: {
  },
};
</script>

<style lang="less" >
@import '../../styles/mixins.less';
@mistake-color: #FFF5F5;

.subform-container {
  -ms-overflow-style:none;
  overflow:-moz-scrollbars-none;
  // width: 100%;
  // box-sizing: border-box;
  // overflow-x: hidden;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  background: #FFFFFF;
  position: absolute;
  top: 0;
  bottom: 0;
  overflow: hidden;
}
.subform-container::-webkit-scrollbar{
  width: 0;
  display: none;
}

.datetime-right-icon {
  width: 52px;
  // height: 45px;
  .px2rem(height, 90);
  position: absolute;
  right: 0;
  top: 0;
}
.datetime-icon {
  position: absolute;
  top: 16px;
  right: 15px;
  color: #c7c7c7;
}
.h3-list-body{
  padding-bottom: 10px;
}
.main-content{
  height: auto;
  overflow-y: scroll;
  .px2rem(margin-bottom,100);
  .has-mistake{
    box-shadow: -15px 0 0 0 @mistake-color;
    background-color: @mistake-color !important;
  }
  .h3-list-item{
    background-color: rgba(0, 0, 0, 0) !important;
  }
  .h3-list-content{
    padding: 0 !important;
  }
  .h3-input-view .h3-input-label{
    color: #333333 !important;
  }
  .h3-multiuser{
    .h3-list-body{
      background-color: rgba(0, 0, 0, 0) !important;
      .px2rem(margin-left,30);
    }
    .h3-list-item{
      padding-left: 0 !important;
      margin-left: 0 !important;
    }
  }
  .switch-content{
    .px2rem(margin-left,30);
    .px2rem(padding-right,30);
    .px2rem(height,90);
    .px2rem(font-size,34);
    position: relative;
    .hairline('bottom',#eeeeee);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .h3-field-layout-h-label{
    .px2rem(width, 234);
  }
}
.form-footer-btn{
  position: absolute;
  z-index: 99;
  right: 0px;
  bottom: 0px;
  .px2rem(height,88);
  width: calc(~'100% - 45px');


//   .accordion-content::after {
//     content: '';
//     display: block;
//     width: 31px;
//     top: 0;
//     height: 100%;
//     position: absolute;
//     background: #f5222d;
//     left: -30px;
// }
}
</style>



