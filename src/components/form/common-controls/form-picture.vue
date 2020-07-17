<template>
  <div class="form-photo">
    <div class="content">
      <div class="name">
        {{ options.DisplayName }}
      </div>
      <div class="select" :class="{forbid}">
        <div class="mask">
          {{ selectMsg }}
        </div>
        <input
          type="file"
          accept="image/png, image/jpeg"
          @click="beforeSelect"
          @change="getFiles"
        />
      </div>
    </div>
    <picture
      :namespace="namespace"
      :initImg="initImg"
      :inputImg="inputImg"
      :editable="editable"
      :multiple="options.uploadmultiple"
      :cameraonly="options.cameraonly"
      :hasWaterMark="options.hasWaterMark"
      :compression="options.compression"
      :uploadBaseUrl="uploadBaseUrl"
      @uploadedPicNums="updatedNums"
      @updateValue="updateValue"
    ></picture>
  </div>
</template>
<script>
// this.options
// DataDictItemValue: null
// DisplayName: "图片"
// Editable: true
// Printable: true
// Required: false
// Type: 23
// cameraonly: "false"
// compression: "false"
// controlkey: "FormPhoto"
// description: null
// displayname: "图片"
// hasWaterMark: "false"
// sourcetype: null
// uploadmultiple: "true"

// this.value
// AttachmentId: "2799b60d-52c5-49c0-b31a-6906ffe93da6"
// Code: "2799b60d-52c5-49c0-b31a-6906ffe93da6"
// Description: null
// Name: "lADPDgQ9qcSF0yfNCkDNB7A_1968_2624.jpg"
// Size: 1537994
// SortKey: 1
// ThumbnailUrl: "https://testci-ossthumbnail.oss-cn-shenzhen.aliyuncs.com/y4tjy0p5bib7f559c3y87qr90/2799b60d-52c5-49c0-b31a-6906ffe93da6"
// Url: "/Form/Download/?AttachmentID=2799b60d-52c5-49c0-b31a-6906ffe93da6"
// name: "lADPDgQ9qcSF0yfNCkDNB7A_1968_2624.jpg"
// size: 1537994
// url: "https://testci-ossthumbnail.oss-cn-shenzhen.aliyuncs.com/y4tjy0p5bib7f559c3y87qr90/2799b60d-52c5-49c0-b31a-6906ffe93da6"

import Picture from '../../picture.vue';
import mixin from '../mixins/base-controler';
import { useDingPhoto } from '../../picture/pic-common';
import { baseUrl } from '../../../config/env';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import imageviewer from 'h3-mobile-vue/src/plugins/imagepreview';

const noticeMsg = '请选择图片';
export default {
  components: {
    Picture,
  },
  mixins: [mixin],
  data () {
    return {
      photos: [
        {
          src: 'http://img.alicdn.com/imgextra/i2/927018118/TB13fBjKFXXXXbPXpXXXXXXXXXX_!!0-tstar.jpg',
        },
        {
          src: 'http://img.alicdn.com/tps/i4/TB1bokgFVXXXXbKXFXXYCct.pXX-238-238.png',
        },
      ],
      selectMsg: noticeMsg,
      selectedNums: 0, // 已完成上传的图片张数
      initImg: [],
      inputImg: [],
      uploadBaseUrl: '',
      forbid: false, // 组件右侧图片icon是否展示
    };
  },
  watch: {
    /**
     * 根据已上传文件个数动态控制当前组件的某些属性
     */
    selectedNums (val) {
      const input = this.$el.querySelector('input');
      if (val > 0) {
        input.disabled = true;
        this.forbid = true;
        this.selectMsg = `已上传${val}张图片`;
      } else {
        input.disabled = false;
        this.forbid = false;
        this.selectMsg = noticeMsg;
      }
    },
  },
  created () {
    const responseContext = this.$parent.form.$responseContext;
    const schemaCode = responseContext.SchemaCode;
    const bizObjectId = responseContext.BizObjectId;
    this.uploadBaseUrl = `${baseUrl}/Form/SheetAttachmentAction/?SchemaCode=${schemaCode}
        &MaxSize=50&BizObjectId=${bizObjectId}`;

    // 初始化Picture组件展示图片
    this.setInitImgs();
  },
  mounted () {
    this.checkMultiple();
    // test
    // imageviewer({
    //   images: this.photos,
    //   index: 0,
    // });
  },
  methods: {
    updatedNums (count) {
      this.selectedNums = count;
    },
    /**
     * 从本地获取选择的图片数组对象
     */
    getFiles (event) {
      const el = event.target;
      this.inputImg = [...el.files];
      event.target.value = null;
    },
    /**
     * 选择图片之前先检测是否直接调用钉钉拍照
     */
    beforeSelect (event) {
      if (this.options.cameraonly === 'true') {
        event.preventDefault();
        useDingPhoto(this.options.hasWaterMark, this.options.compression).then(
          mediaId => {
            this.inputImg = mediaId;
          },
        );
      }
    },
    /**
     * 检测是否可以上传多张图片
     */
    checkMultiple () {
      const el = this.$el.querySelector('input');
      if (this.options.uploadmultiple === 'true') {
        el.multiple = true;
      } else {
        el.multiple = false;
      }
    },
    /**
     * 设置初始图片数组
     */
    setInitImgs () {
      this.value.forEach(item => {
        this.initImg.push({
          AttachmentId: item.AttachmentId,
          ThumbnailUrl: item.ThumbnailUrl,
          state: 1,
          sourceFile: '',
          guid: H3PluginDeveloper.IGuid(),
          thumbStyle: {},
        });
      });
    },
    /**
     * 更新this.value，用于给后台传输AttachmentId
     */
    updateValue (val) {
      // 这里先默认把初始化的attachid也算进去(后续根据实际场景可能有变动)
      this.value.push({
        AttachmentId: val.AttachmentId,
      });
      // 手动触发set函数(this.value.push不会触发set函数)
      this.$updateValue();
    },
  },
};
</script>
<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
    @{name}: @px / @baseFontSize * 1rem;
}
.form-photo {
  padding: 0 0.32rem;
  background: #ffffff;
  color: #666666;
  .content {
    display: flex;
    .px2rem(height, 100);
    .px2rem(line-height, 100);
    .name {
      width: 31.73333%;
    }
    .select {
      position: relative;
      flex-grow: 1;
      .mask {
        color: #999;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        padding: 0 3px;
      }
      input {
        height: 70%;
        width: 100%;
        position: absolute;
        opacity: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      &:after {
        font-family: "aufont";
        font-size: 23px;
        color: #999;
        content: "\EA48";
        float: right;
      }
      &.forbid:after {
        display: none;
      }
    }
  }
}
</style>
