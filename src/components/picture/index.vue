<template>
  <div class="picture" :class="{hide: photoList.length === 0}">
    <div class="list">
      <div v-for="item in photoList" class="item" :key="item.guid">
        <div class="thumbnail" :style="item.thumbStyle">
          <div class="mask" :class="{hide: item.state == 1}">
            <div :class="{loading: item.state == 0}"></div>
            <span
              class="reupload"
              :class="{hide: item.state != 5}"
              @click="reupload(item, $event)"
            >重新上传</span>
          </div>
        </div>
        <i class="del" @click="deletePic(item, $event)" :class="{hide: !editable}"></i>
      </div>
      <div class="add" :class="{hide: !showAdd}">
        <svg name width="32px" height="32px" fill="#000" viewBox="0 0 32 32">
          <path d="M17 15V2h-2v13H2v2h13v13h2V17h13v-2H17z"></path>
        </svg>
        <input type="file" accept="image/png, image/jpeg" @click="beforeSelect" @change="getFiles">
      </div>
    </div>
  </div>
</template>
<script>
////////////////////////////////////////////钉钉拍照上传
// AttachmentId:"f6cd3a54-f041-4fed-a46e-5d6eb6d4aa9e"
// FileExceed:false
// FileId:"60b9c949-5922-4fc4-aedf-e9d00c224019"
// ResultStr:""
// State:1
// ThumbnailUrl:"https://testci-ossthumbnail.oss-cn-shenzhen.aliyuncs.com/y4tjy0p5bib7f559c3y87qr90/f6cd3a54-f041-4fed-a46e-5d6eb6d4aa9e"
// Url:null

// ------WebKitFormBoundaryYGo34QfgGxgyD3wt
// Content-Disposition: form-data; name="fileToUpload"

// null
// ------WebKitFormBoundaryYGo34QfgGxgyD3wt--

////////////////////////////////////////////普通选图上传
// ------WebKitFormBoundaryqchRVjVkVpvdWAfg
// Content-Disposition: form-data; name="FileID"

// 1f0737e4-8e97-4990-8f16-96e86581c72b
// ------WebKitFormBoundaryqchRVjVkVpvdWAfg
// Content-Disposition: form-data; name="图片"; filename="IMG_7439.jpg"
// Content-Type: image/jpeg

// ------WebKitFormBoundaryqchRVjVkVpvdWAfg--
import { useDingPhoto, uploadFile } from "./pic-common";
import H3PluginDeveloper from "../../lib/h3-plugins-developer";
import { mapActions } from "vuex";
import { ViewModelAction } from '@/store/modules/form/viewModel/types';


export default {
  data() {
    return {
      photoList: [],    //当前组件所有图片信息数组(包括未上传、上传中、已上传、需要重新上传)
      uploadedPicNums: 0,   //已完成上传图片张数
      deleteFiles: ""
    };
  },
  props: {
    //图片组件命名空间
    namespace: {
      type: String,
      default: ""
    },
    //初始化传入图片对象
    initImg: {
      type: Array,
      default: []
    },
    //动态传入图片对象
    inputImg: {
      type: Array,
      default: []
    },
    //是否可编辑
    editable: {
      type: Boolean,
      default: false
    },
    //是否支持上传多张图片
    multiple: {
      type: String,
      default: "false"
    },
    //是否仅支持钉钉拍照上传
    cameraonly: {
      type: String,
      default: "false"
    },
    //是否钉钉拍照加水印(只有钉钉拍照才可加水印)
    hasWaterMark: {
      type: String,
      default: "false"
    },
    //图片是否作压缩处理
    compression: {
      type: String,
      default: "false"
    },
    //上传接口前置url
    uploadBaseUrl: {
      type: String,
      default: ""
    }
  },
  computed: {
    /**
     * 是否展示 "+" 号图标判断
     */
    showAdd() {
      if (
        this.photoList.length > 0 &&
        this.editable &&
        this.multiple == "true"
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    this.photoList = JSON.parse(JSON.stringify(this.initImg));
    this.$emit("uploadedPicNums", this.getUploadedPicNums());
  },
  mounted() {
    this.photoList.forEach(item => {
      this.setThumbStyle(item, item.ThumbnailUrl);
    });
  },
  methods: {
    ...mapActions("Form/ViewModel", {
      deleteFile: Action.DELFILES,
      addUploadingFile: Action.ADDUPLOADINGFILE,
      popUploadedFile: Action.POPUPLOADEDFILE
    }),
    /**
     * 从本地获取选择的图片数组对象
     */
    getFiles(event) {
      let el = event.target;
      this.addImg([...el.files]);
      el.value = null;
    },
    /**
     * 选择图片之前先检测是否直接调用钉钉拍照
     */
    beforeSelect(event) {
      if (this.cameraonly === "true") {
        event.preventDefault();
        useDingPhoto(this.hasWaterMark, this.compression).then(mediaId => {
          this.addImg(mediaId);
        });
      }
    },
    /**
     * 获取已成功上传图片张数
     */
    getUploadedPicNums() {
      return this.photoList.filter(item => {
        return item.state == 1;
      }).length;
    },
    /**
     * 删除图片(实际上只更新delFiles，并不调用api)
     * @param {object} 要删除的图片对象
     * @param {object} 事件
     */
    deletePic(item, event) {
      event.stopPropagation();
      this.photoList.splice(this.photoList.indexOf(item), 1);
      this.deleteFiles += `${item.AttachmentId};`;
      this.$emit("uploadedPicNums", this.getUploadedPicNums());
      //更新delattachid
      this.deleteFile({
        namespace: this.namespace,
        delFiles: this.deleteFiles
      });
    },
    /**
     * 重新上传当前图片(当上传状态为5的时候才出现)
     * @param {object} 要重新上传的图片对象
     * @param {object} 事件
     */
    reupload(item, event) {
      event.stopPropagation();
      item.state = 0;
      this.upload(item);
    },
    /**
     * 设置图片缩略图展示样式(当前策略：取短边的100%，然后移动长边至长边的中间位置展示)
     * @param {object} 要设置的图片对象
     * @param {object} 源图片文件(string/File)
     */
    setThumbStyle(item, file) {
      let size = this.$el.querySelector(".thumbnail").clientWidth;
      let img = new Image();
      if (typeof file == "string") {
        img.src = file;
      } else {
        try {
          img.src = URL.createObjectURL(file);
        } catch (err) {
          item.thumbStyle = {
            "background-image": "url('')",
            "background-position": "0 0",
            "background-size": "100% 100%"
          };
        }
      }
      img.onload = () => {
        if (img.naturalWidth / img.naturalHeight > 1) {
          item.thumbStyle = {
            "background-image": `url('${img.src}')`,
            "background-position": `-${parseInt(
              ((img.naturalWidth / img.naturalHeight - 1) * size) / 2
            )}px 0`,
            "background-size": `auto 100%`
          };
        } else if (img.naturalWidth / img.naturalHeight < 1) {
          item.thumbStyle = {
            "background-image": `url('${img.src}')`,
            "background-position": `0 -${parseInt(
              ((img.naturalHeight / img.naturalWidth - 1) * size) / 2
            )}px`,
            "background-size": `100% auto`
          };
        } else {
          item.thumbStyle = {
            "background-image": `url('${img.src}')`,
            "background-position": `0 0`,
            "background-size": `100% 100%`
          };
        }
      };
      img.onerror = () => {
        //handle error
      };
    },
    /**
     * 上传图片
     * @param {object} 文件对象
     */
    upload(fileItem) {
      uploadFile(fileItem, this.uploadBaseUrl, (state, info) => {
        this.photoList.forEach(item => {
          if (item.guid == fileItem.guid) {
            item.AttachmentId = info.AttachmentId;
            item.ThumbnailUrl = info.ThumbnailUrl;
            item.state = info.state;
            // item.state = 5
          }
        });
        this.$emit("uploadedPicNums", this.getUploadedPicNums());
        //更新uploadedfile
        if (state == 1) {
          this.popUploadedFile({
            namespace: this.namespace,
            fileId: fileItem.guid
          });
          this.$emit("updateValue", fileItem);
        }
      });
      //更新uploadingfile
      this.addUploadingFile({
        namespace: this.namespace,
        fileId: fileItem.guid
      });
    },
    addImg(files) {
      files.forEach(item => {
        this.upload(this.addPhotoList(item));
      });
    },
    addPhotoList(file) {
      let imgItem = {
        AttachmentId: "",
        ThumbnailUrl: "",
        state: 0,
        sourceFile: file,
        guid: H3PluginDeveloper.IGuid(),
        thumbStyle: {}
      };
      this.photoList.push(imgItem);
      //先出thumbnail展示架子，再去设置thumbnail样式
      this.$nextTick(() => {
        this.setThumbStyle(imgItem, file);
      });

      return imgItem;
    }
  },
  watch: {
    /**
     * 组件外有图片传入，则开始展示并上传该图片
     */
    inputImg(val) {
      this.addImg(val);
    }
  }
};
</script>
<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.picture {
  padding: 5px 0 0;
  .list {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 2px 0;
    > div {
      margin-right: 10px;
      margin-bottom: 10px;
      .px2rem(height, 150);
      .px2rem(width, 150);
      box-sizing: border-box;
    }
    .item {
      position: relative;
      .thumbnail {
        width: 100%;
        height: 100%;
        .mask {
          text-align: center;
          width: 100%;
          height: 100%;
          background: #616060;
          opacity: 0.7;
          padding: 20px 0;
          box-sizing: border-box;
          .loading {
            width: 25px;
            height: 25px;
            margin: 0 auto;
            border-radius: 50%;
            border: 3px solid #bebebe;
            border-left: 3px solid #fff;
            animation: load 1s linear infinite;
          }
          @keyframes load {
            from {
              -webkit-transform: rotate(0deg);
            }
            to {
              -webkit-transform: rotate(360deg);
            }
          }
          .reupload {
            color: #fff;
            vertical-align: -webkit-baseline-middle;
            &.hide {
              display: none;
            }
          }
          &.hide {
            display: none;
          }
        }
      }
      .del {
        display: inline-block;
        position: absolute;
        top: -8px;
        right: -8px;
        width: 16px;
        height: 16px;
        background: #000;
        border-radius: 50%;
        transform: rotate(45deg);
        .mixin(@width, @height) {
          background: #fff;
          content: "";
          position: absolute;
          display: inline-block;
          width: @width;
          height: @height;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        &:before {
          .mixin(1px, 12px);
        }
        &:after {
          .mixin(12px, 1px);
        }
        &.hide {
          display: none;
        }
      }
    }
    .add {
      position: relative;
      border: 1px dashed rgba(31, 56, 88, 0.2);
      svg {
        fill: rgba(31, 56, 88, 0.4);
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      input {
        opacity: 0;
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
      }
      &.hide {
        display: none;
      }
    }
  }
  &.hide {
    display: none;
  }
}
</style>


