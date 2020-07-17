<template>
  <layout
    :title="DisplayName"
    :showHeader="!$store.state.corpId && !isExternalFormBol && !enableReviewExternalForm && !isExternalShare"
  >
    <!-- lbb修改代码规范 -->
    <div class="approve-popup">
      <!-- <div class="approve-wrapper"> -->
      <div class="content approve-content">
        <div
          v-if="controlForm.Text.Active"
          class="input-item"
          :class="{'valid-error': ValidError.Text}"
        >
          <p class="input-label">
            文本意见
            <span v-if="controlForm.Text.Require" class="required">*</span>
          </p>
          <textarea
            v-model="inputCommnets"
            class="dp-font28"
            rows="3"
            placeholder="请输入意见"
            :class="{'error': ValidError.Text}"
            @click="textareaTap($event)"
          ></textarea>
        </div>
        <!-- 添加/删除签名 -->
        <div
          v-if="controlForm.Signature.Active"
          class="add-pic-wrap"
          :class="{'valid-error': ValidError.Signature}"
        >
          <div class="add-head add-pic-head" @click="goToSignature">
            <div class="left">
              手写签名
              <span v-if="controlForm.Signature.Require" class="required">*</span>
            </div>
            <div v-show="!signatureUrl" class="right">
              <i class="dp-font28">添加</i>
            </div>
          </div>
          <ul v-show="signatureUrl" class="pic-list">
            <li>
              <img
                v-if="signatureUrl"
                :src="signatureUrl"
                alt
                class="signature-img"
                @error="handleError($event)"
              />
              <span class="icon-reset h3yun_All close-circle" @click="deleteSignature"></span>
            </li>
          </ul>
        </div>
        <!-- 上传图片 -->
        <div
          v-if="controlForm.Picture.Active"
          class="add-pic-wrap"
          :class="{'valid-error': ValidError.Picture}"
        >
          <div class="add-head add-pic-head">
            <div class="left">
              图片
              <span v-if="controlForm.Picture.Require" class="required">*</span>
              <p class="dp-font24">
                已添加{{ Object.keys(AddPics).length }}张照片
              </p>
            </div>
            <div class="right">
              <i class="dp-font28">添加</i>
            </div>
            <input
              type="file"
              accept="image/*;capture=camera"
              multiple="multiple"
              class="fileinput"
              @change="addPic"
            />
          </div>
          <ul v-show="picNum > 0" class="pic-list">
            <li v-for="(item,index) in AddPics" :key="index" :ref="index">
              <img
                :id="item.AttachmentId || item.Code"
                v-if="item.ThumbnailUrl"
                :src="item.ThumbnailUrl"
                alt
                @click="previewImage(AddPics,index)"
              />
              <span class="h3yun_All close-circle icon-reset" @click="delPic(item,index)"></span>
              <div class="mask"></div>
            </li>
          </ul>
        </div>

        <!-- 上传附件 -->
        <div
          v-if="controlForm.Attachment.Active"
          class="add-attachment-wrap"
          :class="{'valid-error': ValidError.Attachment}"
        >
          <div class="add-head add-attachment-head">
            <div class="left">
              附件
              <span v-if="controlForm.Attachment.Require" class="required">*</span>
              <p class="dp-font24">
                已添加{{ Object.keys(AddAttachments).length }}个附件
              </p>
            </div>
            <div class="right">
              <i class="dp-font28">添加</i>
            </div>
            <input
              class="fileinput"
              type="file"
              accept="image/*;capture=camera"
              multiple="multiple"
              @change="UploadAttachments"
            />
          </div>
          <div v-show="Object.keys(AddAttachments).length > 0" class="attachment-list">
            <div
              v-for="(item,index) in AddAttachments"
              :key="index"
              :ref="index"
              class="file-box"
            >
              <div class="file-main">
                <div class="file-bg icon h3yun_All" :class="showIcon(item)"></div>
                <!-- <img :src="item.file" alt="CY" class="file-bg" v-if='!fileBgBol'> -->
              </div>
              <div class="file-box-right">
                <div class="file-mess">
                  <div class="file-name dp-font28">
                    {{ item.name }}
                  </div>
                  <div class="file-size">
                    <span class="dp-font22">{{ item.size }}</span>
                    <span v-if="item.state == 100" class="dp-font22 upload-error-font">上传失败</span>
                  </div>
                </div>
                <i class="icon h3yun_All delete-o" @click.stop="delAttachment(item,index)"></i>
              </div>
              <div class="file-upload-bc"></div>
            </div>
          </div>
        </div>
        <div class="push"></div>
      </div>
      <!-- </div> -->
      <div class="approve-footer">
        <a slot="bottom" class="approve-btn dp-font32 bd-top" @click="commentSubmit">提交</a>
      </div>
    </div>
    <div v-transfer-dom>
      <h3-popup v-model="showMode" class="partSign">
        <div @click="handWrite">
          手动输入
        </div>
        <div v-if="hasStoreSign" @click="storeSign">
          <div>
            <p>复用签名</p>
            <p>使用上一次的签名</p>
          </div>
        </div>
        <div>
          <div>
            <p>使用本地签名</p>
            <p>可上传本地手写签名图片</p>
            <input
              type="file"
              accept="image/*;capture=camera"
              class="fileinput"
              @change="uploadSign"
            />
          </div>
        </div>
        <p></p>
        <div @click="showMode = false">
          取消
        </div>
      </h3-popup>
    </div>
  </layout>
</template>
<script>
import { baseUrl } from '../../config/env';
import { H3Popup } from 'h3-mobile-vue';
import TransferDom from 'h3-mobile-vue/src/directives/transfer-dom';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { isiOS, FormDataShim } from '../../config/common';
import { SolutionState } from '../../config/license';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import { getLicenseFilter, getUserRecentSignature } from '../../service/get-data';
// import * as FormLogic from '@/lib/form-logic/index';
import * as FormLogic from 'h3yun-formlogic';
import resultHandler from '../../utils/result-handler';
import imagepreview from 'h3-mobile-vue/src/plugins/imagepreview';
export default {
  name: 'approve',
  directives: {
    TransferDom,
  },
  components: {
    H3Popup,
  },
  data () {
    return {
      hasStoreSign: true, // 曾经签名过
      showMode: false,
      bizObjectId: '',
      signatureList: [],
      commentPlaceholder: '请输入您的审批意见',
      commentItem: {},
      destActivity: '',
      inputCommnets: '',
      SheetAttachmentHandler: `${baseUrl}/Form/SheetAttachmentAction/`,
      previewUrlHandler: `${baseUrl}/Form/MobilePreView?attachmentId=`,
      imgPreviewUrlHandler: `${baseUrl}/Form/DownloadFileByUUID?corpid=${this.$store.state.corpId}&uid=`,
      getUUidUrl: `${baseUrl}/Form/GetDownloadFileUUIDs/?AttachmentIdStr=`,
      DocFileExtension: ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf', 'txt'],
      AddAttachments: {},
      AddPics: {},
      DisplayName: '',
      failImgURL: '',
      signatureUrl: '',
      storeUrl: '', // 展示上次存的签名
      fileBgBol: false, // 显示图片还是文件icon
      imageFileExtension: '.png.bmp.jpg.jpeg.gif.PNG.BMP.JPG.JPEG.GIF',
      scroll: null,
      previewShow: false,
      current: 0,
      photos: [],
      setLeftCallback: null,
      schemaCode: '',
      currentCommentId: null,
      controlForm: {
        Text: { Code: 'Text', Name: '审批意见', Active: true, Require: false },
        Signature: { Code: 'Signature', Name: '签名', Active: true, Require: false },
        Picture: { Code: 'Picture', Name: '图片', Active: true, Require: false },
        Attachment: { Code: 'Attachment', Name: '附件', Active: true, Require: false },
      }, // 表单项控制逻辑数据
      ValidError: {
        Text: false,
        Signature: false,
        Picture: false,
        Attachment: false,
      },
      picIcon: require('../../assets/img/icon-pic.png'),
      imagePreviewer: null,
      isExternalFormBol: false,
      isExternalShare: false,
      enableReviewExternalForm: false,
    };
  },
  computed: {
    defaultedIndex () {
      for (let i = 0; i < this.signatureList.length; i += 1) {
        const signature = this.signatureList[i];
        if (signature.defaulted) {
          return i;
        }
      }
      return -1;
    },
    picNum () {
      return this.getObjPropCount(this.AddPics);
    },
  },
  created () {
    const globalConfig = window.GlobalConfig;
    if (window.GlobalConfig.isExternalForm) {
      this.imgPreviewUrlHandler = `${baseUrl}/Form/DownloadFileByUUID?corpid=${this.$store.state.corpId}&engineCode=${window.GlobalConfig.engineCode}&uid=`;
    }
    this.$root.eventHub.$on('setSignature', url => {
      this.signatureUrl = url;
    });
    this.isExternalFormBol = globalConfig.isExternalForm;
    this.isExternalShare = globalConfig.isExternalShare;
    this.enableReviewExternalForm = globalConfig.enableReviewExternalForm;
  },
  mounted () {
    this.initPage();
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'formPage') {
      this.$root.eventHub.$off('setSignature');
      this.$store.state.excludeComp = ['approve'];
    } else if (to.name === 'lightListPage') {
      // this.destroyFormLogic({ bizObjectId: this.bizObjectId });
      FormLogic.destroy({
        store: this.$store,
        bizObjectId: this.bizObjectId,
      });
      this.$store.state.excludeComp = ['approve'];
    } else if (to.name === 'approval') {
      this.$store.state.excludeComp = ['approve'];
    } else if (to.name === 'list') {
      this.$store.state.excludeComp = ['approve']; // 目前没有发现哪种场景 这个页面需要缓存
    } else {
      this.$store.state.excludeComp = [];
    }
    this.$h3.modal.hide();
    next();
  },
  methods: {
    initPage () {
      this.commentPlaceholder = this.$route.params.commentPlaceholder;
      if (this.$route.params.commmentItem) {
        this.commentItem = JSON.parse(this.$route.params.commmentItem);

        if (this.commentItem.CommentConfig) {
          const commentItems = this.commentItem.CommentConfig.Items || [];
          const controlForm = {};
          commentItems.forEach((item) => {
            controlForm[item.Code] = item;
          });
          this.controlForm = controlForm;
        }

        // 回显暂存意见
        const Comments = this.commentItem.Comments;
        if (Comments) {
          for (let i = 0; i < Comments.length; i++) {
            if (Comments[i].IsMyComment) {
              this.inputCommnets = Comments[i].Text;
            }
          }
        }
      }

      this.destActivity = this.$route.params.destActivity;
      this.schemaCode = this.$route.params.schemaCode;
      this.bizObjectId = this.$route.params.bizObjectId;
      this.currentCommentId = this.$route.params.currentCommentId;
      if (this.commentItem) {
        this.DisplayName = this.commentItem.Text;
      }
      if (!isiOS) {
        $(this.$el)
          .find('textarea')
          .attr('autofocus', true);
      }
    },
    async getLicenseFilterAsync (schemaCode) {
      this.updated = false;
      const data = await getLicenseFilter(schemaCode);
      // if (data.Successful) {
      // }
    },
    back () {
      // this.$router.replace('formPage');
      this.$router.goBack();
    },
    commentSubmit () {
      if (!this.Validate()) {
        return;
      }

      if (!this.validateRequired()) {
        return;
      }
      const val = this.getValue();
      this.$root.eventHub.$off('setSignature');
      this.dispatchDoAction(this.commentItem, this.inputCommnets, val);
    },
    // 分发提交
    dispatchDoAction (item, inputCommnets, attachments) {
      const self = this;
      const namespace = 'Form/ViewModel/';
      const actionResult = this.$store.dispatch(namespace + ViewModelAction.DOACTION, {
        bizObjectId: this.bizObjectId,
        actionControl: item,
        inputCommnets,
        attachments,
        url: this.signatureUrl,
        currentCommentId: this.currentCommentId,
      });
      actionResult.then((response) => {
        if (response && response.Successful) {
          H3PluginDeveloper.IHidePreLoader();
          resultHandler(item, response.ReturnData.StartFormResponse, self, self.bizObjectId);
        }
      });
    },
    getValue () {
      const attachmentArr = [];
      for (const item in this.AddPics) {
        if (Object.prototype.hasOwnProperty.call(this.AddPics, item)) {
          attachmentArr.push(this.AddPics[item].AttachmentId);
        }
      }
      for (const obj in this.AddAttachments) {
        if (Object.prototype.hasOwnProperty.call(this.AddAttachments, obj)) {
          attachmentArr.push(this.AddAttachments[obj].AttachmentId);
        }
      }
      return attachmentArr;
    },
    // 上传图片
    addPic (e) {
      if (window.GlobalConfig.solutionStates.indexOf(SolutionState.FileSizeExceed) > -1) {
        this.showLimitedTips();
        return;
      }
      const files = e.target.files;
      for (let i = 0; i < files.length; i += 1) {
        const fileid = H3PluginDeveloper.IGuid();
        this.temporaryFile = files[i]; // 临时变量
        const nameArr = this.temporaryFile.name.split('.');
        if (!this.isWxImage(this.temporaryFile.name) && this.imageFileExtension.indexOf(nameArr[nameArr.length - 1]) < 0) {
          H3PluginDeveloper.IShowWarn('提示', '只能上传图片');
        } else if (this.temporaryFile.size > 10 * 1024 * 1024) {
          H3PluginDeveloper.IShowWarn('提示', '上传图片大小不能大于10MB');
        } else {
          // 需要添加的附件
          this.$set(this.AddPics, fileid, {
            fileid,
            file: files[i],
            xhr: new XMLHttpRequest(),
            state: 0, // 0:未上传完，1:已上传完,100:失败
          });
          this.UploadPicFile(fileid);
        }
      }
      e.target.value = '';
    },
    // 上传图片
    UploadPicFile (fileid) {
      if (this.AddPics[fileid] == null && this.AddPics[fileid].state !== 0) return;
      const fd = new FormData();
      const file = this.AddPics[fileid].file;
      // 针对从手机微信上保存的图片
      const valueType = file.type && file.type.split('/')[1];
      let fileName = file.name;
      if (this.isWxImage(file.name) && !valueType) {
        fileName += '.jpg';
      }
      fd.append('fileToUpload', new File([file], fileName, { type: file.type || 'image/jpeg' }));
      const xhr = this.AddPics[fileid].xhr;

      xhr.context = this;
      xhr.upload.fileid = fileid;
      xhr.abort.fileid = fileid;
      // 需要判断浏览器是否支持onprogress事件
      // xhr.upload.onprogress = function () { };
      //     //不支持显示上传进度条事件，模拟进度条
      this.SimulatePicProgress(fileid, 0);

      xhr.fileid = fileid;
      xhr.addEventListener('load', this.UploadPicComplete, false);
      xhr.addEventListener('error', this.UploadPicFailed, false);
      xhr.addEventListener('abort', this.UploadPicCanceled, false);

      const sharingKey = H3PluginDeveloper.IQuery('SharingKey');
      const engineCode = H3PluginDeveloper.IQuery('EngineCode');
      const SchemaCode =
        this.$store.state.Form.ViewModel[this.bizObjectId].$responseContext.SchemaCode;
      const uploadHandler =
        `${this.SheetAttachmentHandler}?SchemaCode=${encodeURI(SchemaCode)}&SharingKey=${sharingKey}&EngineCode=${engineCode}&BizObjectId=${this.$store.state.Form.ViewModel[this.bizObjectId].$responseContext.BizObjectId}&FileID=`;
      xhr.open('POST', uploadHandler + fileid);
      xhr.send(fd);
    },
    SimulatePicProgress (fileid, steps) {
      let step = steps;
      const that = this;
      this.$nextTick(() => {
        const $progress = $(that.$refs[fileid][0])
          .find('.mask')
          .eq(0);
        if (that.AddPics[fileid].state !== 1) {
          // $progress.style.display = "inline-block";
          $progress.css('display', 'inline-block');
          // 3s内进度条跑到99%，每100ms执行一次，上传完后删除
          if (step < 95) {
            step += 5;
            // $progress.style.top = step + "%";
            $progress.text(`${step}%`);
            // $progress.innerHtml = step + "%";
            that.AddPics[fileid].step = step;
            that.$set(that.AddPics[fileid], 'step', step);
            that.$forceUpdate();
            that.timeOut = setTimeout(() => {
              that.SimulatePicProgress(fileid, step);
            }, 100);
          } else if (that.timeOut) {
            clearTimeout(that.timeOut);
          }
        } else if (that.timeOut) {
          clearTimeout(that.timeOut);
        }
      });
    },
    UploadPicComplete (evt) {
      const $progress = $(this.$refs[evt.currentTarget.fileid][0]).find('.mask')[0];
      if (evt.target.status === 200) {
        $progress.style.display = 'none';
        const resultObj = eval(`(${evt.target.responseText})`);
        const fileid = resultObj.FileId;
        this.$set(this.AddPics[fileid], 'state', 1);
        this.$set(this.AddPics[fileid], 'AttachmentId', resultObj.AttachmentId);
        this.$set(this.AddPics[fileid], 'ThumbnailUrl', resultObj.ThumbnailUrl);
        if (resultObj.State === 4) {
          // H3PluginDeveloper.IShowWarn('温馨提醒', resultObj.ResultStr);
          return;
        }
      } else {
        this.UploadFailed(evt);
      }
      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }
    },

    UploadPicFailed (evt) {
      const $progress = $(this.$refs[evt.currentTarget.fileid][0]).find('.progress')[0];
      this.AddPics[evt.currentTarget.fileid].state = 100;
      $progress.style.display = 'none';
      this.step = '';
      this.failImgURL = '/static/img/pic-loadfail.png';
    },

    // 添加附件
    UploadAttachments (e) {
      if (window.GlobalConfig.solutionStates.indexOf(SolutionState.FileSizeExceed) > -1) {
        this.showLimitedTips();
        return;
      }
      this.uploadBol = true;
      const files = e.target.files;
      for (let i = 0; i < files.length; i += 1) {
        const fileid = H3PluginDeveloper.IGuid();
        files[i].fileid = fileid;
        this.CreateFileElement(fileid, files[i].name, files[i].size, null, files[i]);
      }
    },
    // 创建上传元素
    // 有url就是已经上传的控件，不需要判断size 大小
    CreateFileElement (fileid, name, size, url, file) {
      const that = this;
      this.fileSizeStr = 0;
      if (size > 1024 * 1024) {
        this.fileSizeStr = `${(Math.round((size * 100) / (1024 * 1024)) / 100).toString()}MB`;
      } else {
        this.fileSizeStr = `${(Math.round((size * 100) / 1024) / 100).toString()}KB`;
      }

      // 标志是否能上传
      const flag = true;
      this.fileName = name;
      let fileType = '';
      if (this.fileName.lastIndexOf('.') > 0) {
        this.fileName = name.substring(0, name.lastIndexOf('.'));
        if (this.fileName.toLowerCase() === 'image') {
          this.fileName = `image${that.Files + 1}`;
        }
        fileType = name.substring(name.lastIndexOf('.'), name.length).toLowerCase();
      }
      // 没有上传过
      // 判断文件大小

      if (that.imageFileExtension.indexOf(fileType.toLowerCase()) > -1) {
        if (file !== undefined) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function onload () {
            const result = this.result;
            let img = new Image();
            img.src = result;

            that.fileBgSrc = this.result;

            // 如果图片大小小于100kb，则直接上传
            if (result.length <= 100 * 1024) {
              // img = null;

              if (result.length > 1024 * 1024) {
                that.fileSizeStr = `${(Math.round((size * 100) / (1024 * 1024)) / 100).toString()}MB`;
              } else {
                that.fileSizeStr = `${(Math.round((size * 100) / 1024) / 100).toString()}KB`;
              }
              that.$set(that.AddAttachments, fileid, {
                name,
                size: that.fileSizeStr,
                fileid,
                file: result,
                xhr: new XMLHttpRequest(),
                state: 0, // 0:未上传完，1:已上传完,100:失败
              });
              that.UploadAttachmentFile(fileid, fileType, name);
              return;
            }

            function callback () {
              const data = that.Compress(img, 0.4);

              if (data.length > 1024 * 1024) {
                that.fileSizeStr = `${(Math.round((data.length * 100) / (1024 * 1024)) / 100).toString()}MB`;
              } else {
                that.fileSizeStr = `${(Math.round((data.length * 100) / 1024) / 100).toString()}KB`;
              }
              // 上传
              that.$set(that.AddAttachments, fileid, {
                name,
                size: that.fileSizeStr,
                fileid,
                file: data,
                xhr: new XMLHttpRequest(),
                state: 0, // 0:未上传完，1:已上传完,100:失败
              });
              that.UploadAttachmentFile(fileid, fileType, name);
              img = null;
            }

            // 图片加载完毕之后进行压缩，然后上传
            if (img.complete) {
              callback();
            } else {
              img.onload = callback;
            }
          };
        } else {
          // this.fileBgSrc = "/Form/Download/?AttachmentID=" + fileid
        }
      } else {
        that.fileBgBol = true;

        if (file.size > 1024 * 1024) {
          that.fileSizeStr = `${(Math.round((file.size * 100) / (1024 * 1024)) / 100).toString()}MB`;
        } else {
          that.fileSizeStr = `${(Math.round((file.size * 100) / 1024) / 100).toString()}KB`;
        }
        // 上传
        that.$set(that.AddAttachments, fileid, {
          name,
          size: that.fileSizeStr,
          fileid,
          file,
          xhr: new XMLHttpRequest(),
          state: 0, // 0:未上传完，1:已上传完,100:失败
        });
        that.UploadAttachmentFile(fileid, fileType, name);
      }

      if (flag) {
        this.Files += 1;
      }
      return flag;
    },
    // scale 压缩比例
    Compress (img, scale) {
      let width = img.width;
      let height = img.height;
      let ratio = '';
      ratio = (width * height) / 4000000;
      if (ratio > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      this.Canvas = document.createElement('canvas');
      this.Ctx = this.Canvas.getContext('2d');
      // 瓦片cancas
      this.TCanvas = document.createElement('canvas');
      this.TCtx = this.TCanvas.getContext('2d');

      this.Canvas.width = width;
      this.Canvas.height = height;
      // 铺底色
      this.Ctx.fillStyle = '#fff';
      this.Ctx.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
      // 如果图片像素大于100万则使用瓦片绘制
      let count = (width * height) / 1000000;
      if (count > 1) {
        /* eslint-disable no-bitwise */
        count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
        // 计算每块瓦片的宽和高
        const nw = ~~(width / count);
        const nh = ~~(height / count);
        this.TCanvas.width = nw;
        this.TCanvas.height = nh;
        for (let i = 0; i < count; i += 1) {
          for (let j = 0; j < count; j += 1) {
            this.TCtx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            this.Ctx.drawImage(this.TCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        this.Ctx.drawImage(img, 0, 0, width, height);
      }

      // 进行最小压缩
      const ndata = this.Canvas.toDataURL('image/jpeg', scale);

      this.TCanvas.width = 0;
      this.TCanvas.height = 0;
      this.Canvas.width = 0;
      this.Canvas.height = 0;
      return ndata;
    },
    // 上传
    UploadAttachmentFile (fileid, type, fileName) {
      if (this.AddAttachments[fileid] == null && this.AddAttachments[fileid].state !== 0) return;
      let blob = '';
      if (this.imageFileExtension.indexOf(type.toLowerCase()) > -1) {
        const basestr = this.AddAttachments[fileid].file;
        const text = window.atob(basestr.split(',')[1]);
        const buffer = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i += 1) {
          buffer[i] = text.charCodeAt(i);
        }
        // 将type从.png转成image/png,不然后台无法判断文件是否是图片。（判断根据是type是否已image开头）
        let typeTemp = type;
        if (typeTemp.indexOf('.') === 0) {
          typeTemp = typeTemp.substring(1, typeTemp.length);
        }
        typeTemp = `image/${typeTemp}`;
        blob = this.GetBlob([buffer], typeTemp);
      }

      const formdata = this.GetFormData();

      if (this.imageFileExtension.indexOf(type.toLowerCase()) > -1) {
        formdata.append('imagefile', blob);
      } else {
        formdata.append('fileToUpload', this.AddAttachments[fileid].file);
      }
      const xhr = this.AddAttachments[fileid].xhr;
      xhr.context = this;
      xhr.upload.fileid = fileid;
      xhr.abort.fileid = fileid;
      const SchemaCode =
        this.$store.state.Form.ViewModel[this.bizObjectId].$responseContext.SchemaCode;
      let JAttachmentHandlerUrl = '';
      JAttachmentHandlerUrl = `${
        this.SheetAttachmentHandler
        }?SchemaCode=${SchemaCode}&FileID=${fileid}&FileName=${encodeURI(fileName)}&FileType=${encodeURI(type)}`;
      xhr.open('post', JAttachmentHandlerUrl);
      xhr.upload.addEventListener('progress', this.UploadAttachmentProgress, false);
      xhr.addEventListener('load', this.UploadAttachmentComplete, false);
      xhr.addEventListener('error', this.UploadAttachmentFailed, false);
      xhr.send(formdata);
    },
    UploadAttachmentProgress (evt) {
      this.$forceUpdate();
      const $progress = $(this.$refs[evt.currentTarget.fileid][0]).find('.file-upload-bc')[0];
      if (!$progress) {
        return;
      }
      if (evt.lengthComputable) {
        let percentComplete = Math.round((evt.loaded * 100) / evt.total);
        /*
        * 在上传大文件的时候，在后台处理的时间会比较久
        * 先只将上传进度显示为99%，在UploadComplete里改为100%
        */
        percentComplete = percentComplete === 100 ? 99 : percentComplete;
        $progress.style.right = `${100 - percentComplete}%`;
      } else {
        this.AddAttachments[evt.currentTarget.fileid].state = 100;
        $progress.style.backgroundColor = '#FF0000';
      }
    },

    UploadAttachmentComplete (evt) {
      const $progress = $(this.$refs[evt.target.upload.fileid][0]).find('.file-upload-bc')[0];
      if (!$progress) {
        return;
      }
      if (evt.target.status === 200) {
        this.fileBoxBol = false;
        const resultObj = eval(`(${evt.target.responseText})`);
        // this.value.push(resultObj)
        const fileid = resultObj.FileId;
        this.AddAttachments[fileid].AttachmentId = resultObj.AttachmentId;
        this.AddAttachments[fileid].state = 1;
        // this.scroll.refresh();
        if (resultObj.State === 4) {
          // H3PluginDeveloper.IShowWarn('温馨提醒', resultObj.ResultStr);
          return;
        }
        if (resultObj.State === 2) {
          this.AddAttachments[fileid].state = 100;
          H3PluginDeveloper.IShowWarn('温馨提醒', resultObj.ResultStr);
          return;
        }
        /*
        *android对upload的progress事件支持不完善
        *在Complete事件里将上传进度赋值为100%
        */
        $progress.style.display = 'none';

        // this.Validate();
      } else {
        this.UploadFailed(evt);
      }
    },

    UploadAttachmentFailed () {
      this.AddAttachments.state = 100;
      this.$refs.progresser.style.color = 'red';
    },
    GetBlob (buffer, format) {
      try {
        return new Blob(buffer, {
          type: format,
        });
      } catch (e) {
        const bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder)();
        buffer.forEach(buf => {
          bb.append(buf);
        });
        return bb.getBlob(format);
      }
    },
    // 获取formdata
    GetFormData () {
      /* eslint-disable no-bitwise */
      const isNeedShim =
        ~navigator.userAgent.indexOf('Android') &&
        ~navigator.vendor.indexOf('Google') &&
        !~navigator.userAgent.indexOf('Chrome') &&
        navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 354;
      return isNeedShim ? new FormDataShim() : new FormData();
    },
    delPic (item, index) {
      this.$delete(this.AddPics, index);
    },
    delAttachment (item, index) {
      this.$delete(this.AddAttachments, index);
    },
    showIcon (item) {
      const itemType = item.name.split('.')[1];
      if (itemType === 'txt' || itemType === 'doc' || itemType === 'docx') {
        return 'h3yun_All word-file-o';
      } else if (itemType === 'xls' || itemType === 'xlsx') {
        return 'h3yun_All excle-file-o';
      } else if (itemType === 'jpg' || itemType === 'png') {
        return 'h3yun_All jpg-file-o';
      } else if (itemType === 'pdf') {
        return 'h3yun_All pdf-file-o';
      }
      return 'h3yun_All unknow-file-o';
    },
    // 校验是否上传完成
    Validate () {
      // 如果是支持Html5的话，得判断是否已经上传完整，需要等待
      for (const key in this.AddPics) {
        if (this.AddPics[key].state !== 1) {
          H3PluginDeveloper.IShowWarn('提示', '图片未上传完');
          return false;
        }
      }
      for (const key in this.AddAttachments) {
        if (this.AddAttachments[key].state !== 1) {
          H3PluginDeveloper.IShowWarn('提示', '附件未上传完');
          return false;
        }
      }
      return true;
    },
    // 校验必填项
    validateRequired () {
      let validResult = true;
      const controlForm = this.controlForm;

      // 校验审批意见
      if (controlForm.Text.Active &&
        controlForm.Text.Require &&
        this.inputCommnets == '') {
        validResult = false;
        this.ValidError.Text = true;
      }

      // 校验审批意见
      if (controlForm.Signature.Active &&
        controlForm.Signature.Require &&
        this.signatureUrl == '') {
        validResult = false;
        this.ValidError.Signature = true;
      }

      // 校验图片
      if (controlForm.Picture.Active &&
        controlForm.Picture.Require &&
        this.getObjPropCount(this.AddPics) === 0) {
        validResult = false;
        this.ValidError.Picture = true;
      }
      // 校验附件
      if (controlForm.Attachment.Active &&
        controlForm.Attachment.Require &&
        this.getObjPropCount(this.AddAttachments) === 0) {
        validResult = false;
        this.ValidError.Attachment = true;
      }

      setTimeout(() => {
        this.ValidError = {
          Text: false,
          Signature: false,
          Picture: false,
          Attachment: false,
        };
      }, 1000);
      return validResult;
    },
    goToSignature () {
      if (this.signatureUrl) {
        return;
      }
      getUserRecentSignature().then(res => {
        const result = res.ReturnData.Signature;
        if (result) {
          this.storeUrl = result;
          this.hasStoreSign = true;
        } else this.hasStoreSign = false;
        this.showMode = true;
      }).catch(r => {
        H3PluginDeveloper.IShowWarn('提示', '出错啦，请联系管理员');
      });
    },
    getBase64 (img) {
      function getBase64Image (img, width, height) { // width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
        let canvas = document.createElement('canvas');
        canvas.width = width || img.width;
        canvas.height = height || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL();
        canvas = null;
        return dataURL;
      }
      const image = new Image();
      image.crossOrigin = '';
      image.src = img;
      if (img) {
        const deferred = new Promise(function (resolve) {
          image.onload = function () {
            resolve(getBase64Image(image));// 将base64传给done上传处理
          };
        });
        return deferred;// 问题要让onload完成后再return
      }
    },
    // 手动输入
    handWrite () {
      const screenWidth = window.screen.availWidth;
      const screenHeight = window.screen.availHeight;
      this.$router.push({
        name: 'signatureImg',
        params: {
          screenWidth,
          screenHeight,
        },
      });
    },
    // 展示上次手写签名
    storeSign () {
      this.getBase64(this.storeUrl).then((res) => {
        this.$h3.modal.show({
          content: `<div style="max-height:200px;min-height:100px;overflow:auto;"
              ><img src=${res} style="width:100%;"></div>`,
          type: 'alert',
          actions: [
            {
              text: '取消',
              onPress: () => {
              },
            },
            {
              text: '确定',
              onPress: () => {
                this.signatureUrl = res;
                this.showMode = false;
              },
            },
          ],
        });
      });
    },
    // 上传签名
    uploadSign (e) {
      const file = e.target.files[0];
      const nameArr = file.name.split('.');
      if (!this.isWxImage(file.name) && this.imageFileExtension.indexOf(nameArr[nameArr.length - 1]) < 0) {
        H3PluginDeveloper.IShowWarn('提示', '只能上传图片');
      } else if (file.size > 10 * 1024 * 1024) {
        H3PluginDeveloper.IShowWarn('提示', '上传图片大小不能大于10MB');
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);// 读出 base64
        const that = this;
        reader.onload = function onload () {
          const result = this.result;
          if (result.length <= 100 * 1024) {
            that.signatureUrl = that.reBase(result);
            that.showMode = false;
            return;
          }
          let img = new Image();
          img.src = result;
          function callback () {
            const data = that.Compress(img, 0.4);
            that.signatureUrl = that.reBase(data);
            that.showMode = false;
            img = null;
          }
          // 图片加载完毕之后进行压缩，然后上传
          if (img.complete) {
            callback();
          } else {
            img.onload = callback;
          }
        };
      }
      e.target.value = ''; // 删除后再次上传相同图片执行change
    },
    // 判断是否是微信保存的图片
    isWxImage (fileName) {
      return /^mmexport\d+$/.test(fileName) || /^wx_camera_\d+$/.test(fileName);
    },
    reBase (res) {
      const base = res.split(',');
      const str = 'data:image/png;base64';
      let newBase = '';
      if (base[0] !== str) newBase = `${str},${base[1]}`;
      else newBase = res;
      return newBase;
    },
    deleteSignature () {
      this.signatureUrl = '';
      this.$root.eventHub.$emit('clearSignature');
    },
    updataShow () {
      this.photos = [];
      this.backStack.pop();
    },
    previewImage (photos, index) {
      if (this.previewShow) return;
      this.previewShow = true;
      const tmpPhotos = [];
      Object.keys(photos).forEach((item) => {
        tmpPhotos.push({ url: photos[item].ThumbnailUrl, code: photos[item].AttachmentId });
      });
      const tmpArr = [];
      tmpPhotos.forEach((file) => {
        const item = {};
        tmpArr.push(this.getUUid(file, item));
      });
      this.current = Object.keys(photos).indexOf(index);
      Promise.all(tmpArr).then(data => {
        this.imagePreviewer = imagepreview({
          images: data,
          index: this.current,
          onClose: () => {
            this.backStack.pop();
          },
          download: () => {},
        });
        this.backStack.push(() => {
          this.imagePreviewer.$destroy();
        });
      }).catch(err => {
        console.log(err);
      });
    },
    getUUid (tmpFile, item) {
      const attachmentId = tmpFile.code;
      const url = `${this.getUUidUrl}${attachmentId}`;
      const that = this;
      return new Promise((resovle, reject) => {
        $.ajax({
          type: 'POST',
          url,
          success (data) {
            if (data) {
              resovle(`${window.location.origin}${that.imgPreviewUrlHandler}${data[attachmentId]}`);
            }
          },
          error (err) {
            throw (err);
          },

        });
      });
    },
    showLimitedTips () {
      let tipsMessage = '附件量<span style="color: red;">已达上限</span>，请通知公司管理员购买升级附件量套餐。';
      if (window.GlobalConfig.isAdministrator) {
        tipsMessage = '附件量<span style="color: red;">已达上限</span>，请联系客服购买升级附件量套餐。';
      }
      this.$h3.modal.show({
        title: '限制提醒',
        content: tipsMessage,
        type: 'alert',
        actions: [{ text: '知道了', onPress: () => { } }],
      });
    },
    getObjPropCount (obj) {
      let count = 0;
      for (const i in obj) {
        if (obj.hasOwnProperty(i)) {
          count++;
        }
      }
      return count;
    },
    textareaTap ($event) {
      if ($event && isiOS && $event.target !== document.activeElement) {
        $event.target.focus();
      }
    },
    handleError ($event) {
      $event.currentTarget.src = this.picIcon;
    },
  },
};
</script>

<style lang="less">
@import "../../styles/mixins.less";
@import "./approve.less";

</style>
