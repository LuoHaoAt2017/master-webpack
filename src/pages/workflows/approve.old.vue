<template>
<!-- lbb修改代码规范 -->
    <!-- <transition enter-active-class="animated slideInRight slide-animation" leave-active-class="animated slideOutRight slide-animation"> -->
        <view-box class="approve-popup">
            <x-header class="header" slot="header" :left-options="{preventGoBack:true}" @on-click-back="back()" v-if="!$store.state.corpId">
                {{DisplayName}}
            </x-header>
            <!-- <div class="approve-wrapper"> -->
            <div class="content approve-content">
                <div class="input-item" v-if="controlForm.Text.Active" :class="{'valid-error': ValidError.Text}">
                    <p class="input-label">文本意见<span class="required" v-if="controlForm.Text.Require">*</span></p>
                    <textarea class="dp-font28" rows="3" placeholder="请输入意见" v-model="inputCommnets" :class="{'error': ValidError.Text}" @click="textareaTap($event)"></textarea>
                </div>
                <!-- 添加/删除签名 -->
                <div class="add-pic-wrap" v-if="controlForm.Signature.Active" :class="{'valid-error': ValidError.Signature}">
                    <div class="add-head add-pic-head" @click="goToSignature">
                        <div class="left">
                          手写签名<span class="required" v-if="controlForm.Signature.Require">*</span>
                        </div>
                        <div class="right" v-show="!signatureUrl">
                            <i class="dp-font28">添加</i>
                        </div>
                    </div>
                  <ul class="pic-list" v-show="signatureUrl">
                    <li>
                      <img :src="signatureUrl" v-if="signatureUrl" alt="" class="signature-img" v-on:error="handleError($event)">
                      <span class="icon-reset" @click="deleteSignature"></span>
                    </li>
                  </ul>
                </div>
                <!-- 上传图片 -->
                <div class="add-pic-wrap" v-if="controlForm.Picture.Active" :class="{'valid-error': ValidError.Picture}">
                    <div class="add-head add-pic-head">
                        <div class="left">
                            图片<span class="required" v-if="controlForm.Picture.Require">*</span>
                            <p class="dp-font24">已添加{{Object.keys(AddPics).length}}张照片</p>
                        </div>
                        <div class="right">
                            <i class="dp-font28">添加</i>
                        </div>
                        <input type="file" accept="image/*;capture=camera" multiple="multiple" @change='addPic'>
                    </div>
                    <ul class="pic-list" v-show="picNum > 0">
                        <li v-for="(item,index) in AddPics" :key="index" :ref='index'>
                            <img :src="item.ThumbnailUrl" v-if="item.ThumbnailUrl" :id='item.AttachmentId||item.Code' alt="" @click="previewImage(AddPics,index)">
                            <span class="icon-reset" @click='delPic(item,index)'></span>
                            <div class="mask"></div>
                        </li>
                    </ul>

                </div>

                <!-- 上传附件 -->
                <div class="add-attachment-wrap" v-if="controlForm.Attachment.Active" :class="{'valid-error': ValidError.Attachment}">
                    <div class="add-head add-attachment-head">
                        <div class="left">
                            附件<span class="required" v-if="controlForm.Attachment.Require">*</span>
                            <p class="dp-font24">已添加{{Object.keys(AddAttachments).length}}个附件</p>
                        </div>
                        <div class="right">
                            <i class="dp-font28">添加</i>
                        </div>
                        <input type="file" accept="image/*;capture=camera" multiple="multiple" @change='UploadAttachments'>
                    </div>
                    <div class="attachment-list" v-show='Object.keys(AddAttachments).length>0'>
                        <div class="file-box" v-for="(item,index) in AddAttachments" :key="index" :ref='index'>
                            <div class="file-main">
                                <div class="file-bg icon" :class='showIcon(item)'></div>
                                <!-- <img :src="item.file" alt="CY" class="file-bg" v-if='!fileBgBol'> -->
                            </div>
                            <div class="file-box-right">
                                <div class="file-mess">
                                    <div class="file-name dp-font28">{{item.name}}</div>
                                    <div class="file-size">
                                        <span class="dp-font22">{{item.size}}</span>
                                        <span class="dp-font22 upload-error-font" v-if='item.state==100'>上传失败</span>
                                    </div>
                                </div>
                                <i class="icon icon-shanchu" @click.stop='delAttachment(item,index)'></i>
                            </div>
                            <div class="file-upload-bc"></div>
                        </div>
                    </div>
                </div>
              <div class="push"></div>
            </div>
            <!-- </div> -->
            <div v-transfer-dom>
                <image-viewer v-if="photos.length>0"
                  :show="previewShow"
                  :photos="photos"
                  :current="current"
                  @update:show="updataShow"
                  >
                </image-viewer>
            </div>
            <div class="approve-footer">
              <a slot="bottom" class="approve-btn dp-font32 bd-top" @click='commentSubmit'>提交</a>
            </div>
        </view-box>
    <!-- </transition> -->
</template>
<script>
import { XHeader, ViewBox } from 'vux';
import { setTitle, setLeft } from '../../config/dingtalk-interface';
import SmartForm from '../../lib/smart-form.bak';
import { baseUrl } from '../../config/env';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { isiOS, FormDataShim } from '../../config/common';
import { SolutionState } from '../../config/license';
import ImageViewer from '../../../packages/components/h3-imageviewer/index.vue';
import { TransferDom } from 'vux';
import { getLicenseFilter } from '../../service/get-data';

export default {
  name: 'approve',
  components: {
    XHeader,
    ViewBox,
    ImageViewer,
  },
  data() {
    return {
      signatureList: [],
      commentPlaceholder: '请输入您的审批意见',
      commentItem: {},
      destActivity: '',
      postValue: {},
      groupValue: {},
      fromRoute: '',
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
      fileBgBol: false, // 显示图片还是文件icon
      imageFileExtension: '.png.bmp.jpg.jpeg.gif.PNG.BMP.JPG.JPEG.GIF',
      scroll: null,
      previewShow: false,
      current: 0,
      photos: [],
      setLeftCallback: null,
      schemaCode: '',
      currentCommentId: null,
      controlForm:{
        Text:{Code:"Text",Name:"审批意见",Active:true,Require:false},
        Signature:{Code:"Signature",Name:"签名",Active:true,Require:false},
        Picture:{Code:"Picture",Name:"图片",Active:true,Require:false},
        Attachment:{Code:"Attachment",Name:"附件",Active:true,Require:false}
      },  //表单项控制逻辑数据
      ValidError: {
        Text: false,
        Signature: false,
        Picture: false,
        Attachment: false,
      },
      picIcon: require('../../assets/img/icon-pic.png'),
    };
  },
  directives: {
    TransferDom,
  },
  created() {
    if (window.GlobalConfig.isExternalForm) {
      this.imgPreviewUrlHandler = `${baseUrl}/Form/DownloadFileByUUID?corpid=${this.$store.state.corpId}&engineCode=${window.GlobalConfig.engineCode}&uid=`;
    }
    this.$root.eventHub.$on('setSignature', url => {
      this.signatureUrl = url;
    });
  },
  mounted() {
    this.commentPlaceholder = this.$route.params.commentPlaceholder;
    if (this.$route.params.commmentItem) {
      this.commentItem = JSON.parse(JSON.stringify(this.$route.params.commmentItem));

      if(this.commentItem.CommentConfig){
        let commentItems = this.commentItem.CommentConfig.Items || []
        let controlForm = {}
        commentItems.forEach((item) => {
          controlForm[item.Code] = item
        })
        this.controlForm = controlForm
      }

      //回显暂存意见
      let Comments = this.commentItem.Comments
      if(Comments){
        for(let i=0; i<Comments.length; i++){
          if(Comments[i].IsMyComment){
            this.inputCommnets = Comments[i].Text
          }
        }
      }
    }

    this.destActivity = this.$route.params.destActivity;
    this.postValue = this.$route.params.postValue;
    this.groupValue = this.$route.params.groupValue;
    this.fromRoute = this.$route.params.fromRoute;
    this.schemaCode = this.$route.params.schemaCode;
    this.currentCommentId = this.$route.params.currentCommentId;
    if (this.commentItem) {
      this.DisplayName = this.commentItem.Text;
    }
    if (!isiOS) {
      $(this.$el)
        .find('textarea')
        .attr('autofocus', true);
    }

    //仅限于在开发环境使用
    if(!this.$store.state.corpId){
      $(this.$el).find('#vux_view_box_body').css('height', ($(this.$el).height() - $(this.$el).find('.vux-header').outerHeight()) + 'px')
    }

  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'formPage') {
      this.$root.eventHub.$off('setSignature');
      this.$store.state.excludeComp = ['approve'];
    } else {
      this.$store.state.excludeComp = [];
    }
    next();
  },
  methods: {
    async getLicenseFilterAsync(schemaCode) {
      this.updated = false;
      const data = await getLicenseFilter(schemaCode);
      // if (data.Successful) {
      // }
    },
    back() {
      // this.$router.replace('formPage');
      this.$router.goBack();
    },
    commentSubmit() {

      if (!this.Validate()) {
        return;
      }

      if (!this.validateRequired()) {
        return;
      }

      const val = this.getValue();
      this.$root.eventHub.$off('setSignature');
      // this.$store.state.excludeComp = ['approve'];
      if (this.commentItem.Action === 'Reject') {
        SmartForm.Reject(
          this.commentItem,
          this.inputCommnets,
          val,
          this.destActivity,
          this.postValue,
          this.groupValue,
          this,
          this.fromRoute,
          this.signatureUrl,
          this.currentCommentId,
        );
      } else {
        SmartForm.Submit(
          this.commentItem,
          this.inputCommnets,
          val,
          this.destActivity,
          this.postValue,
          this.groupValue,
          this,
          this.fromRoute,
          this.signatureUrl,
          null,
          null,
          null,
          null,
          null,
          null,
          this.currentCommentId,
        );
      }
      // this.$destroy();
    },
    getValue() {
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
    addPic(e) {
      if (window.GlobalConfig.solutionStates.indexOf(SolutionState.FileSizeExceed) > -1) {
        this.showLimitedTips();
        return;
      }
      const files = e.target.files;
      for (let i = 0; i < files.length; i += 1) {
        const fileid = H3PluginDeveloper.IGuid();
        this.temporaryFile = files[i]; // 临时变量
        const nameArr = this.temporaryFile.name.split('.');
        if (this.imageFileExtension.indexOf(nameArr[nameArr.length - 1]) < 0) {
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
    UploadPicFile(fileid) {
      if (this.AddPics[fileid] == null && this.AddPics[fileid].state !== 0) return;
      const fd = new FormData();
      fd.append('fileToUpload', this.AddPics[fileid].file);
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
      const SchemaCode = this.$store.state.formData.responseContext.SchemaCode;
      const uploadHandler = `${this.SheetAttachmentHandler}?SchemaCode=${encodeURI(
        SchemaCode
      )}&SharingKey=${sharingKey}&EngineCode=${engineCode}&BizObjectId=${
        this.$store.state.formData.responseContext.BizObjectId
      }&FileID=`;
      xhr.open('POST', uploadHandler + fileid);
      xhr.send(fd);
    },
    SimulatePicProgress(fileid, steps) {
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
    UploadPicComplete(evt) {
      const $progress = $(this.$refs[evt.currentTarget.fileid][0]).find('.mask')[0];
      const $img = $(this.$refs[evt.currentTarget.fileid][0]).find('img');
      if (evt.target.status === 200) {
        $progress.style.display = 'none';
        const resultObj = eval(`(${evt.target.responseText})`);
        const fileid = resultObj.FileId;
        this.AddPics[fileid].state = 1;
        this.AddPics[fileid].AttachmentId = resultObj.AttachmentId;
        this.AddPics[fileid].ThumbnailUrl = resultObj.ThumbnailUrl;
        this.$forceUpdate();
        $img.attr('src', resultObj.ThumbnailUrl);
        // this.scroll.refresh();
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

    UploadPicFailed(evt) {
      const $progress = $(this.$refs[evt.currentTarget.fileid][0]).find('.progress')[0];
      this.AddPics[evt.currentTarget.fileid].state = 100;
      $progress.style.display = 'none';
      this.step = '';
      this.failImgURL = '/static/img/pic-loadfail.png';
    },

    // 添加附件
    UploadAttachments(e) {
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
    CreateFileElement(fileid, name, size, url, file) {
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
          reader.onload = function onload() {
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

            function callback() {
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
    Compress(img, scale) {
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
    UploadAttachmentFile(fileid, type, fileName) {
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
      const SchemaCode = this.$store.state.formData.responseContext.SchemaCode;
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
    UploadAttachmentProgress(evt) {
      this.$forceUpdate();
      const $progress = $(this.$refs[evt.currentTarget.fileid][0]).find('.file-upload-bc')[0];
      if(!$progress){
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

    UploadAttachmentComplete(evt) {
      const $progress = $(this.$refs[evt.target.upload.fileid][0]).find('.file-upload-bc')[0];
      if(!$progress){
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

    UploadAttachmentFailed() {
      this.AddAttachments.state = 100;
      this.$refs.progresser.style.color = 'red';
    },
    GetBlob(buffer, format) {
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
    GetFormData() {
      /* eslint-disable no-bitwise */
      const isNeedShim =
        ~navigator.userAgent.indexOf('Android') &&
        ~navigator.vendor.indexOf('Google') &&
        !~navigator.userAgent.indexOf('Chrome') &&
        navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 354;
      return isNeedShim ? new FormDataShim() : new FormData();
    },
    delPic(item, index) {
      this.$delete(this.AddPics, index);
    },
    delAttachment(item, index) {
      this.$delete(this.AddAttachments, index);
    },
    showIcon(item) {
      const itemType = item.name.split('.')[1];
      if (itemType === 'txt' || itemType === 'doc' || itemType === 'docx') {
        return 'icon-word';
      } else if (itemType === 'xls' || itemType === 'xlsx') {
        return 'icon-excel';
      } else if (itemType === 'jpg' || itemType === 'png') {
        return 'icon-tupian2';
      } else if (itemType === 'pdf') {
        return 'icon-pfd';
      }
      return 'icon-weizhi';
    },
    // 校验是否上传完成
    Validate() {
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
    validateRequired() {

      let validResult = true
      let controlForm = this.controlForm

      //校验审批意见
      if(controlForm.Text.Active
        && controlForm.Text.Require
        && this.inputCommnets == ''){
        validResult  = false
        this.ValidError.Text = true
      }

      //校验审批意见
      if(controlForm.Signature.Active
        && controlForm.Signature.Require
        && this.signatureUrl == ''){
        validResult  = false
        this.ValidError.Signature = true
      }

      //校验图片
      if(controlForm.Picture.Active
        && controlForm.Picture.Require
        && this.getObjPropCount(this.AddPics) === 0){
        validResult  = false
        this.ValidError.Picture = true
      }
      //校验附件
      if(controlForm.Attachment.Active
        && controlForm.Attachment.Require
        && this.getObjPropCount(this.AddAttachments) === 0){
        validResult  = false
        this.ValidError.Attachment = true
      }

      setTimeout(() => {
        this.ValidError = {
          Text: false,
          Signature: false,
          Picture: false,
          Attachment: false,
        }
      }, 1000)
      return validResult
    },
    goToSignature() {

      if(this.signatureUrl){
        return
      }

      let screenWidth = window.screen.availWidth;
      let screenHeight = window.screen.availHeight;
      this.$router.push({
        name: 'signatureImg',
        params: {
          screenWidth,
          screenHeight,
        },
      });
    },
    deleteSignature() {
      this.signatureUrl = '';
      this.$root.eventHub.$emit('clearSignature');
    },
    updataShow() {
      this.photos = [];
      this.previewShow = false;
      if (this.setLeftCallback) {
        setLeft(this.setLeftCallback);
      }
    },
    previewImage(photos, index) {
      const self = this;
      const tmpPhotos = [];
      Object.keys(photos).forEach((item) => {
        tmpPhotos.push({ url: photos[item].ThumbnailUrl, code: photos[item].AttachmentId });
      });

      tmpPhotos.forEach((file) => {
        const item = {};
        this.getUUid(file, item);
        self.photos.push(item);
      });

      this.current = Object.keys(photos).indexOf(index);
      this.previewShow = true;

      this.setLeftCallback = setLeft.callback;
      setLeft(() => {
        this.previewShow = false;
        setLeft(this.setLeftCallback);
      });
    },
    getUUid(tmpFile, item) {
      const attachmentId = tmpFile.code;
      const url = `${this.getUUidUrl}${attachmentId}`;
      const that = this;
      $.ajax({
        type: 'POST',
        url,
        success(data) {
          if (data) {
            that.$set(item, 'url', `${window.location.origin}${that.imgPreviewUrlHandler}${data[attachmentId]}`);
          }
        },
      });
    },
    showLimitedTips() {
      let tipsMessage = '附件量<span style="color: red;">已达上限</span>，请通知公司管理员购买升级附件量套餐。';
      if (window.GlobalConfig.isAdministrator) {
        tipsMessage = '附件量<span style="color: red;">已达上限</span>，请联系客服购买升级附件量套餐。';
      }
      this.$h3.modal.show({
        title: '限制提醒',
        content: tipsMessage,
        type: 'alert',
        actions: [{ text: '知道了', onPress: () => {} }],
      });
    },
    getObjPropCount(obj) {
      let count = 0;
      for(let i in obj) {
        if(obj.hasOwnProperty(i)) {
          count++;
        }
      }
      return count;
    },
    textareaTap($event) {
      if ($event && isiOS && $event.target !== document.activeElement){
        $event.target.focus();
      }
    },
    handleError($event) {
      $event.currentTarget.src = this.picIcon;
    },
  },
  activated() {
    const self = this;
    // console.log(this.DisplayName);
    setTitle(this.DisplayName);
    window.backFn = function b() {
      self.back();
    };
    setLeft(window.backFn);
  },
  computed: {
    defaultedIndex() {
      for (let i = 0; i < this.signatureList.length; i += 1) {
        const signature = this.signatureList[i];
        if (signature.defaulted) {
          return i;
        }
      }
      return -1;
    },
    picNum() {
      return this.getObjPropCount(this.AddPics)
    }
  },
};
</script>

<style lang="less">
@import '../../styles/mixins.less';

@font-color6: #666666;
@font-color9: #999999;
@font-color0: #000000;
@font-color3: #333333;
@font-color-blue: #108ee9;
@font-color-red: #e64340;
@bc-color-red: #ff0000;
.approve-content{
  min-height: 100%;
  .px2rem(margin-bottom, -154);
}

.push{
  .px2rem(height, 154);
}

.approve-popup {
  width: 100%;
  height: 100%;
  background-color: #f8f9fb;
  position: fixed;
  z-index: 99999; // overflow:scroll;
  // .px2rem(padding-bottom,98);
  .weui-tab__panel{
    padding-bottom: 0;
  }
  .required{
    color:#ff0000;
    vertical-align: middle;
    .px2rem(font-size, 30);
  }
  .valid-error textarea,
  .valid-error.input-item .input-label,
  .add-pic-wrap.valid-error,
  .add-attachment-wrap.valid-error{
    background-color: rgba(255, 0, 0, 0.06);
    // -webkit-animation: twinkling .5s linear infinite;
    animation: twinkling .5s linear infinite;
  }

  @-webkit-keyframes twinkling{
    0%{
      opacity: 0;
    }
    40%{
      opacity: 1;
    }
    100%{
      opacity: 1;
    }
  }
  .input-item {
    font-size: 0;
    //background-color: white;
    .input-label{
      .px2rem(height, 50);
      .px2rem(line-height, 50);
      .px2rem(padding-top, 20);
      .px2rem(padding-bottom, 20);
      .px2rem(padding-left, 30);
      .px2rem(font-size, 30);
      color:#333;
      background-color: #f8f8f8;
    }
    textarea {
      width: 100%;
      .px2rem(padding-top, 25);
      .px2rem(padding-right, 30);
      .px2rem(padding-left, 30);
      .px2rem(padding-bottom, 25);
      .px2rem(min-height, 388);
      .px2rem(line-height, 42);
      .px2rem(font-size, 30);
      box-sizing: border-box;

    }
    textarea.error::-webkit-input-placeholder {
      color: #E64340;
    }
  }
  .add-pic-wrap,
  .add-attachment-wrap {
    background-color: white; // margin-top: .24rem;
    .px2rem(margin-top, 24);
    .add-head {
      // height: 1rem;
      .px2rem(height, 90);
      display: flex;
      justify-content: space-between; // padding: 0 .52rem 0 .26rem;
      .px2rem(padding-right, 52);
      .px2rem(padding-left, 26);
      align-items: center;
      position: relative;
      .left {
        //display: flex;
        height:px2rem(height, 50);
        height:px2rem(line-height, 50);
        .px2rem(font-size, 30);
        color:#333;
        .signature {
          .px2rem(width, 50);
          .px2rem(height, 50);
          background-image: url('../../assets/img/signature.svg');
          background-size: 100% 100%;
        }
      }
      .right i{
        .px2rem(font-size, 30);
      }
      p {
        display: inline-block; // margin-left: .16rem;
        .px2rem(margin-left, 16);
        color: #b8babb;
      }
      span {
        // font-size: .5rem;
        .px2rem(font-size, 50);
        color: #979797;
      }
      span.required {
        color:#ff0000;
        vertical-align: middle;
        .px2rem(font-size, 30);
      }
      i {
        color: @font-color-blue;
        font-style: normal;
      }
      input {
        opacity: 0;
        position: absolute; // width: 100%;
        height: 100%;
        width: 100%;
        left: 0;
      }
    }
    .pic-list {
      .px2rem(margin-top, 33);
      font-size: 0;
      .px2rem(padding-right, 27);
      .px2rem(padding-left, 27);
      li {
        position: relative;
        display: inline-block;
        .px2rem(width, 112);
        .px2rem(height, 112);
        .px2rem(margin-right, 32);
        .px2rem(margin-bottom, 22);
        vertical-align: top;
        &:nth-child(5n) {
          margin-right: 0;
        }
        img {
          width: 100%;
          height: 100%;
        }
        .signature-img{
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
        }
        .icon-reset {
          position: absolute;
          right: 0;
          top: 0;
          transform: translate(40%, -30%);
          color: @font-color9;
          &:before {
            color: #999999 !important;
            background-color: white;
            border-radius: 50%;
          }
        }
        .mask {
          position: absolute;
          width: 100%;
          height: 100%;
          text-align: center;
          top: 0;
          left: 0; // line-height: 1.12rem;
          .px2rem(line-height, 112);
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
        }
      }
    }
  }
  .add-attachment-wrap {
    .attachment-list {
      // .px2rem(padding-right,52);
      //.px2rem(padding-bottom, 196);
      .px2rem(padding-bottom, 30);
      .px2rem(padding-left, 27);
      .file-box {
        display: flex; // height: 1.28rem;
        .px2rem(height, 128);
        align-items: center;
        position: relative;
        .file-main {
          // width: .595rem;
          .px2rem(width, 59.5); // height: .631rem;
          .px2rem(height, 63.1); // margin-right: .275rem;
          .px2rem(margin-right, 27.5);
          z-index: 1;
          .icon-fujian2 {
            // font-size: .595rem;
            .px2rem(font-size, 59.5);
            color: @font-color9;
          }
          .file-bg {
            width: 100%;
            height: 100%;
          }
          .icon-weizhi:before,
          .icon-word:before,
          .icon-excel:before,
          .icon-tupian2:before,
          .icon-pdf:before {
            .px2rem(font-size, 60);
          }
        }
        .file-box-right {
          // width: 6.36rem;
          .px2rem(width, 636);
          display: flex;
          border-bottom: 1px solid #ebebeb;
          height: 100%;
          align-items: center;
          z-index: 1;
          position: relative;
          .file-mess {
            width: 80%;
            .file-name,
            .file-size {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
            .file-name {
              color: @font-color0; // height: .4rem;
              .px2rem(height, 40); // line-height: .4rem;
              .px2rem(line-height, 40);
            }
            .file-size {
              color: @font-color9; // height: .3rem;
              .px2rem(height, 30); // line-height: .3rem;
              .px2rem(line-height, 30);
            }
          }
          .icon-shanchu {
            position: absolute; // font-size: .4rem;
            .px2rem(font-size, 40);
            color: @font-color9;
            .px2rem(right, 24);
          }
          .upload-error-font {
            color: #e64340;
          }
        }
        .no-border {
          border: none;
        }
        &:last-child {
          .file-box-right {
            border: none;
          }
        }
        .file-upload-bc {
          width: 100%;
          height: 100%;
          right: 104%;
          top: 0;
          background-color: #c6dfff;
          position: absolute;
        }
      }
    }
  }
  .approve-footer{
    .px2rem(padding, 30);
    .px2rem(margin-top, -154);
  }
  .approve-btn {
    display: inline-block;
    width: 100%;
    .px2rem(height, 94);
    .px2rem(line-height, 94);
    color: #ffffff;
    border: none;
    .px2rem(border-radius, 6);
    // border-top: 1px solid #D9D9D9;
    z-index: 1;
    text-align: center;
    background-color:#1890FF;
  }
  a:active {
    background-color: #0C6CD9;
    // color: #108ee9;
  }
  .approve-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    top: 0;
  }
  .remark-signature-click-area {
    img {
      .px2rem(margin-left, 20);
      .px2rem(max-height, 68);
      .px2rem(max-width, 240);
      vertical-align: middle;
    }
  }
}
</style>
