<template>
  <div class="remark-signature-wrapper">
    <H3TextArea 
      :placeholder="placeholder" 
      :maxLength="maxLength"
      :autofocus="true"
      :clear="false" 
      :showCount="showCount" 
      :hasBottomLine="hasBottomLine"
      className="remark-signature-text-area-wrapper"
      :countStyle="countStyle"
      :realCountCls="realCountCls"
      :h3style="h3style"
      v-model="textareaValue"
      :controlStyle="controlStyle">
    </H3TextArea>
    <div class="remark-signature-input-signature clear" v-if="signatureList.length===0" @click="goToSignature">
      <div class="remark-signature-click-area without-signature">
        签名<i class="icon aufont icon-base-right remark-signature-right"></i>
      </div>
    </div>
    <div class="remark-signature-input-signature clear" v-if="signatureList.length > 0 " @click="goToSignatureList">
      <div class="remark-signature-click-area without-signature" v-if="!hasDefault && !hasQuery">
        签名<i class="icon aufont icon-base-right remark-signature-right"></i>
      </div>

      <div class="remark-signature-click-area without-signature" v-if="!hasDefault && hasQuery">
        <img :src="signatureList[0].src"/>
        <i class="icon aufont icon-base-right remark-signature-right"></i>
      </div>
      <div class="remark-signature-click-area" v-if="hasDefault">
        <img :src="signatureList[defaultedIndex].src" />
        {{signatureList[defaultedIndex].signature}}
        <i class="icon aufont icon-base-right remark-signature-right"></i>
      </div>
    </div>

    <div class="remark-upload-img-wrapper">
      <H3PhotoField
        :multiple="true"
        :corpId="corpId"
        :url="url"
        :readOnly="false"
        :max="max"
        :maxUpload="maxUpload"
        :columns="columns"
        layout="h"
        :autoPending="false"
        name="图片"
        :photoList="photoList"
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
        :placeholder="photoFieldPlaceholder">
      </H3PhotoField>
    </div>

    <!-- <div class="remark-upload-file-wrapper">
      <h3-file-field
        :multiple="true"
        :corpId="corpId"
        :url="url"
        :readOnly="false"
        :fileList="fileList"
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
    </div> -->
    <div class="remark-switch-wrapper" v-if="workflowForm">
      <span>发送给所有参与人</span>
      <h3-switch :color="'rgb(24,144,255)'" v-model="innerChecked"></h3-switch>
    </div>
    <div class="h3-remark-button">
      <h3-button :disabled="disabled" :onClick="this.onClick"><span class="h3-remark-button-name" :class="disabled?'h3-remark-button-name-disabled':''">发送</span></h3-button>
    </div>
    <h3-toast class="h3-remark-toast" :show="toastShow" iconType="check" text="评论成功"></h3-toast>
    <h3-toast class="h3-remark-toast" :show="toastUploadImgShow" iconType="close" text="上传失败"></h3-toast>
  </div>
</template>
<script>
import H3TextArea from '../../components/h3-textarea/index';
import H3Switch from '../../components/h3-switch/index';
import H3PhotoField from '../../components/h3-photofield/index';
import H3FileField from '../../components/h3-file/index';
import H3Button from '../../components/h3-button/index';
import H3Toast from '../../components/h3-toast/index';

export default {
  name: 'remark-signature',
  components: {
    H3TextArea,
    H3Switch,
    H3PhotoField,
    H3FileField,
    H3Button,
    H3Toast,
  },
  props: {
  },
  data() {
    return {
      title: '同意',
      placeholder: '请输入您的审批意见',
      maxLength: 140,
      textareaValue: '', // 评论内容
      clear: true,
      showCount: false,
      hasBottomLine: false,
      commentAreaClassName: 'h3-remark-commentaera',
      textareaStyle: {
        padding: 0,
      },
      iconClsName: 'h3-remark-photo-upload-picture-icon',
      placeholderIcon: 'icon-base-question-circle-o',
      photoFieldPlaceholder: '最多支持8张',
      fontSize: 16, // 根元素的字体大小
      realCountCls: 'h3-remark-real-count',
      workflowForm: true, // 是否是流程表单
      innerChecked: true, // 如果是流程表单 默认为true
      // disabled: false,
      photoList: [],
      fileList: [],
      corpId: '',
      url: '',
      routerFrom: '',
      toastShow: false,
      columns: 4,
      max: 3,
      maxUpload: 8,
      toastUploadImgShow: false,
      signatureList: [],
      hasQuery: false,
    };
  },
  mounted() {
    this.fontSize = parseFloat(document.querySelector('html').style.fontSize);
    this.textareaValue = '';
    // this.showToast();
  },
  // activated() {
  //   const self = this;
  //   // setTitle(this.title);
  //   window.backFn = () => {
  //     self.goBack();
  //   };
  //   // setLeft(window.backFn);
  // },
  beforeRouteEnter(to, from, next) {
    const routerFrom = from.path;
    const signatureData = to.query;
    next((vm) => {
      if (signatureData.img) {
        vm.routerFrom = routerFrom;
        vm.hasQuery = true;
        vm.signatureList.unshift({
          // signature: '新增',
          defaulted: signatureData.isDefault,
          src: signatureData.img,
          added: true,
          signatureId: vm.IGuid(),
        });
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.state.excludeComp = ['remarkTest'];
    next();
  },
  methods: {
    IGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        /* eslint-disable no-bitwise */
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
      });
    },
    onClick() {
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
    goToSignature() {
      this.$router.push('/signature');
    },
    goToSignatureList() {
      // Todo 将数据插入到数据库(在签名页面确定时操作)
      // 目前用路由带参模拟
      this.$router.push({
        path: '/signatureTest',
        query: {
          img: this.signatureList[0].src,
          isDefault: this.signatureList[0].isDefault,
        },
      });
    },
  },
  computed: {
    controlStyle() {
      const paddingTop = 12 / this.fontSize;
      const height = 115 / this.fontSize;
      const paddingBottom = 20 / this.fontSize;
      return {
        padding: '0',
        paddingTop: `${paddingTop}rem`,
        height: `${height}rem`,
        paddingBottom: `${paddingBottom}rem`,
      };
    },
    countStyle() {
      const right = 15 / this.fontSize;
      return {
        position: 'absolute',
        right: `${right}rem`,
        bottom: `${right}rem`,
        color: '#ccc',
      };
    },
    h3style() {
      const lineHeight = 25 / this.fontSize;
      const height = 115 / this.fontSize;
      return {
        lineHeight: `${lineHeight}rem`,
        height: `${height}rem`,
      };
    },
    disabled() {
      if (!this.textareaValue.length || this.photoList.length > 0 || this.fileList.length > 0) {
        return true;
      }
      return false;
    },
    hasDefault() {
      for (let i = 0; i < this.signatureList.length; i += 1) {
        const signature = this.signatureList[i];
        if (signature.defaulted) {
          return true;
        }
      }
      return false;
    },
    defaultedIndex() {
      for (let i = 0; i < this.signatureList.length; i += 1) {
        const signature = this.signatureList[i];
        if (signature.defaulted) {
          return i;
        }
      }
      return -1;
    },
  },
  beforeDestroyed() {
    this.textareaValue = '';
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
.clear::after{
  content: '';
  width: 0;
  display: block;
  clear: both;
  visibility: hidden;
}
.clear{
  zoom: 1;
}
.remark-signature-wrapper{
  width: 100%;
  // .px2rem(height, 1334);
  background-color: #f8f8f8;
  .h3-list-body{
    .hairline('bottom', transparent);
  }
}
.remark-signature-text-area-wrapper{
  // .px2rem(height, 324);
  .px2rem(padding-top, 25);
  .px2rem(padding-bottom, 0) !important;
  .h3-textarea-control{
    padding: 0;
  }
  .h3-textarea-count{
    position: absolute;
    .px2rem(right, 30);
    .px2rem(bottom, 30);
    .px2rem(font-size, 24);
    .px2rem(line-height, 24);
    color: #CCCCCC;
    letter-spacing: 0;
    text-align: right;
    display: none;
    span{
      .px2rem(font-size, 24);
      .px2rem(line-height, 24);
      color: #CCCCCC;
    }
  }
}
.remark-signature-input-signature{
  background: #fff;
  // .px2rem(height, 88);
}
.remark-signature-click-area{
  float:right;
  color: #1890ff;
  display: flex;
  align-items: center;
  .px2rem(font-size, 30);
  .px2rem(line-height, 42);
  // .px2rem(padding-top, 16);
  // .px2rem(padding-bottom, 30);
  // .px2rem(padding-left, 30);
  .px2rem(padding-right, 30);
  .remark-signature-righ{
    .px2rem(font-size, 24);
  }
  img{
    .px2rem(width, 105);
    .px2rem(height, 105);
    .px2rem(margin-right, 30);
  }
}
.without-signature{
  .px2rem(padding-top, 16);
  .px2rem(padding-bottom, 30);
  .px2rem(padding-left, 30);
  i{
    .px2rem(margin-left, 10);
  }
}

.h3-remark-real-count{
  color: #ccc !important;
}


.h3-comment-area-count{
  position: absolute;
  .px2rem(right, 30);
  .px2rem(bottom, 30);
  .px2rem(font-size, 24);
  color: #CCCCCC;
  letter-spacing: 0;
  text-align: right;
}
.h3-remark-photo-upload-picture-icon{
  .px2rem(width, 105);
  .px2rem(height, 90);
  text-align: center;
  .px2rem(line-height, 90);
  i{
    .px2rem(font-size, 40);
    color: #999;
  }
}

.remark-upload-img-wrapper{
  background: #fff;
  .px2rem(margin-top, 24);
  .h3-photo-field{
    .h3-field{
      .px2rem(font-size, 34);
      .px2rem(line-height, 50);
      .h3-field-box{
        span{
          .px2rem(font-size, 34);
          .px2rem(line-height, 50);
        }
        .hairline('bottom', transparent);
      }
      .h3-field-icon{
        .px2rem(padding-right, 30);
        i{
          .px2rem(font-size, 40);
        }
      }
    }
    .h3-photo-list{
      .px2rem(padding-bottom, 30);
      .h3-photo-item{
        padding-bottom: 0 !important;
      }
      .h3-photo-upload-item{
        .px2rem(padding-right, 42) !important;
        .px2rem(width, 136) !important;
        .px2rem(height, 136) !important;
      }
      .h3-photo-upload-item-box{
        position: relative;
      }
      .icon-base-close-circle{
        position: absolute;
        .px2rem(font-size, 32);
        color: #999;
        .px2rem(right, -16);
        .px2rem(top, -16);
      }
      .h3-photo-upload-icon-item{
        .px2rem(width, 136) !important;
        .px2rem(height, 136) !important;
        .px2rem(padding-right, 42) !important;
      }
      .h3-photo-list-upload-icon{
        .px2rem(width, 136) !important;
        .px2rem(height, 136) !important;
      }
    }
  }
  .h3-field-layout-label-required{
    position: absolute;
    .px2rem(left, -12);
    .px2rem(top, 20);
  }
}
.remark-upload-file-wrapper{
  background: #fff;
  .px2rem(margin-top, 24);
  .h3-file-field{
    .h3-field{
      .px2rem(font-size, 34);
      .px2rem(line-height, 50);
      .h3-field-box{
        span{
          .px2rem(font-size, 34);
          .px2rem(line-height, 50);
        }
        .hairline('bottom', transparent);
      }
      .h3-select-field-placeholder{
        color: #999;
      }
      .h3-field-icon{
        .px2rem(padding-right, 30);
        i{
          .px2rem(font-size, 40);
        }
      }
    }
    .h3-file-field-upload-item{
      display: flex;
      align-items: center;
      .px2rem(height, 112);
      .px2rem(padding-left, 30);
      .px2rem(padding-right, 30);
    }
    .h3-file-field-item-icon{
      display: inline-block;
      .px2rem(width, 80);
      .px2rem(height, 80);
      .px2rem(border-radius, 6);
      i{
        display: inline-block;
        .px2rem(width, 80);
        .px2rem(height, 80);
        .px2rem(font-size, 80);
      }
    }
    .h3-file-field-item-content{
      display: flex;
      align-items: center;
      .h3-file-field-item-content-wrapper{
        .px2rem(padding-left, 16);
        .h3-file-field-item-name{
          color: #333;
        }
        .h3-file-field-item-size{
          color: #999;
          .px2rem(margin-top, 5);
          .px2rem(font-size, 24);
          .px2rem(line-height, 33);
        }
      }
      .h3-file-field-item-action{
        .px2rem(padding-left, 30);
        i{
          .px2rem(font-size, 44);
          color: #999;
        }
      }
    }
  }
}

.remark-switch-wrapper{
  .px2rem(margin-top, 24);
  width: 100%;
  .px2rem(height, 90);
  background: #fff;
  .px2rem(padding-left, 30);
  .px2rem(padding-right, 30);
  box-sizing: border-box;
  color: #333333;
  letter-spacing: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  span{
    .px2rem(font-size, 34);
    .px2rem(line-height, 50);
  }
}
.h3-remark-button{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  .px2rem(height, 88);
  .hairline('top', #e4e4e4);
  text-align: center;
  .px2rem(font-size, 34);
  .px2rem(line-height, 88);
  color: #1890ff;
}
.h3-remark-button-name{
  .px2rem(font-size, 34);
  .px2rem(line-height, 88);
  color: #1890ff;
}
.h3-remark-button-name-disabled{
  color: #999;
}


.remark-upload-item-delicon{
  position: absolute;
  .px2rem(font-size, 32);
  color: #999;
  .px2rem(right, -16);
  .px2rem(top, -16);
}

.h3-remark-toast{
  .h3-toast-mask{
    .px2rem(width, 240);
    .px2rem(height, 240);
    opacity: 0.8;
    background: #323334;
    .px2rem(border-radius, 20);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .h3-toast-notice{
      // .px2rem(width, 240);
      // .px2rem(height, 240);
    }
    .h3-toast-notice-content .h3-toast-text{
      background: transparent;
    }
    .h3-toast-notice-content .h3-toast-text.h3-toast-text-icon{
      padding: 0;
    }
    .h3-toast-notice-content{
      padding: 0;
      .h3-icon{
        .px2rem(font-size, 89);
        // position: absolute;
        // .px2rem(top, 31.5);
        // .px2rem(right, 76.5);
      }
      .h3-toast-text-info{
        .px2rem(font-size, 30);
        .px2rem(line-height, 42);
        color: #fff;
        .px2rem(margin-top, 34);
      }
    }
  }
}

</style>


