<template>
<!-- lbb修改代码规范 -->
  <!-- <transition :duration='300' enter-active-class="animated slideInRight" leave-active-class=" "> -->
  <div class="sns-wrapper">
    <!-- <x-header v-if="!$store.state.corpId" :left-options="{preventGoBack:true}" @on-click-back="goBack()">
      {{title+'('+count+')'}}
    </x-header> -->
    <layout :title="title+'('+count+')'" :leftOptions="{ preventGoBack: true }" @on-click-back="goBack">
    <div class="snslist">
      <!-- <scroller ref="myscroller" style="position:relative;" v-if="itemDatas.length>0" -->
      <scroller ref="myscroller" v-if="itemDatas.length>0"
      :on-refresh="refresh"
      :on-infinite="infinite">
        <div class="sns-item-wrap">
          <div v-for="(Item,index) in itemDatas" :key="Item.ObjectId" class="sns-item" :class="index==itemDatas.length-1?'bd-bot':''" >
            <div class="item-wrapper" :class="index==itemDatas.length-1?'':''">
              <div class="item-avator">
                <img :src="Item.ProfilePhotoUrl" v-cloak v-if="Item.ProfilePhotoUrl"/>
                <div v-if="!Item.ProfilePhotoUrl">{{Item.Name.substr(Item.Name.length-2,2)}}
                </div>
              </div>
              <div class="item-content">
                <div class="item-name">
                  {{Item.Name}}
                </div>
                <div class="item-time">
                  {{Item.FormatCreatedTime}}
                </div>
                <div class="item-comment">
                  {{Item.Text}}
                </div>
                <div class="item-files" v-preview="{type:attachmentType, corpId: $store.state.corpId}">
                  <img v-for="img in Item.img" :id="img.ObjectId" :data-name="Item.Name" :key="img.ObjectId" :src="img.ThumbnailUrl">
                  <div class="file-box-wrap">
                    <div class="file-box" v-for="item in Item.file" :key='item.ObjectId' @click='previewAttach(item)'>
                        <div class="file-main">
                            <!-- <div class="file-bg icon" v-if='item.isImg'>
                              <img class="attachImg" :id="item.ObjectId" :data-name="item.Name" :key="item.ObjectId" :src="item.ThumbnailUrl">
                            </div> -->
                            <div class="file-bg icon" :class="showIcon(item)"></div>
                        </div>
                        <div class="file-box-right">
                            <div class="file-mess">
                                <div class="file-name dp-font28">{{item.FileName}}</div>
                                <div class="file-size">
                                    <span class="dp-font22">{{(item.ContentLength / 1024 / 1024).toFixed(2)}}MB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroller>
      <div class="empty-container" v-if="itemDatas.length==0 && updated">
        <img :src="emptyImgUrl" />
        <div class="message">
          暂无数据
        </div>
      </div>
    </div>
    <h3-button class='send-comments' style="{'color': '#1890FF'}" @click='comment()'>评论</h3-button>

     <!-- <div class="sns-comment slideOutDownComment" ref="snscomment" v-show="ready">
      <div class="sns-main" ref="snsMain">
        <div>
          <textarea ref="comment" rows="4"  v-model="snsText"  id="comment" class="text-sns" placeholder="请输入您的评论内容" ></textarea>
          <div class="filelist" ref="filelist" style="display:none;"></div>
        </div>
      </div>
      <div class="sns-buttons" >
        <div v-if="isWorkflow" class="sns-option" @click="toggleSelected">
                        <span class="icon-selected" v-show="optionSelected"></span>
                        <span class="icon-unselected" v-show="!optionSelected"></span>
                        <span>发送消息给所有的参与人</span>
                    </div>
        <div class="trigger">
          <div >
            <span class="icon-pic" @click.stop.prevent="chooseFile()"></span>
            <input type="file" accept="image/*;capture=camera" class="file-upload" style="opacity:0;" />
          </div>
          <div>
            <span @click="submit()" :style="{color:canSend || snsText?'#108ee9':'#d9d9d9'}">发送</span>
          </div>
        </div>
      </div>
    </div> -->


    <!-- <div class="sns-reply bd-top" v-if="ready" v-show="!showComment" @click="toggleToComment()">
      <div  v-if="snsText">{{snsText}}</div>
      <span v-else="">请输入您的评论内容</span>
    </div>
    <div class="comment-mask" ref="mask" @click="hideComment" v-show="showComment">

    </div> -->

    </layout>
  </div>
  <!-- </transition> -->
</template>
<script>
import Vue from 'vue';
import VueScroller from 'vue-scroller';
import BScroll from 'better-scroll';
import { loadPageSNSDataByBizObjectId, addSnsPost, getSnsPreviewFileUrl } from '../../service/get-data';
import { setTitle, setLeft, previewAttachment } from '../../config/dingtalk-interface';
import { isiOS, isDingtalk } from '../../config/common';
import UploadPic from '../../utils/upload-picture';
import { baseUrl, imgBaseUrl } from '../../config/env';
import '../../utils/pre-view';
import preview from '../../directives/preview';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { H3Button } from 'h3-mobile-vue';

Vue.use(VueScroller);
export default {
  name: 'snslist',
  data() {
    return {
      itemDatas: [],
      hasMore: false,
      title: '评论',
      bizObjectId: null,
      pageIndex: 0,
      schemaCode: null,
      isWorkflow: false,
      showComment: false,
      count: 0,
      snsText: '',
      fileIds: '',
      optionSelected: false,
      attachmentType: 'SNS',
      ready: false,
      updated: false,
      emptyImgUrl: `${imgBaseUrl}/img/empty.png`,
      canSend: false,
      hScroll: null,
      imageFileExtension: '.png.bmp.jpg.jpeg.gif.PNG.BMP.JPG.JPEG.GIF',
      docExtension: '.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.txt',
    };
  },
  components: {
    H3Button,
  },
  directives: {
    preview,
  },
  created() {
    const that = this;
    this.schemaCode = this.$route.params.schemaCode;
    this.bizObjectId = this.$route.params.bizObjectId;
    this.getSnsData(this.schemaCode, this.bizObjectId, this.pageIndex);
    this.$root.eventHub.$on('Sns-Added', () => {
      that.doRefresh();
    });
  },
  beforeDestroy() {
    this.$root.eventHub.$off('Sns-Added');
  },
  methods: {
    goBack() {
      if ($('div.fly-zoom-box').length > 0) {
        $('.fly-zoom-box-close').click();
      } else if (this.showComment) {
        this.showComment = false;
        $('.sns-comment')
          .removeClass('slideInUpComment')
          .addClass('slideOutDownComment');
      } else {
        this.removePreventDefault();
        this.$router.go(-1);
      }
    },
    // 获取SNS数据
    async getSnsData(schemaCode, bizObjectId, pageIndex) {
      this.updated = false;
      const data = await loadPageSNSDataByBizObjectId(schemaCode, bizObjectId, pageIndex);
      if (data.Successful) {
        this.itemDatas = this.itemDatas.concat(data.ReturnData.Posts);
        this.separatePhotosAndFiles();
        this.count = data.ReturnData.Count;
        // 更新评论总数
        if (Math.ceil(this.itemDatas.length / 10)) {
          this.hasMore = true;
        }
        this.updated = true;
        this.$root.eventHub.$emit('sns-updated', this.count);
        this.isWorkflow = data.ReturnData.IsWorkflow;
      }
    },
    // 把获取到的文件分成图片和附件
    separatePhotosAndFiles() {
      this.itemDatas.forEach((items) => {
        const item = items;
        if (item.Files.length && !item.img && !item.file) {
          item.Files.forEach((secItems) => {
            const secItem = secItems;
            const fileNameArr = secItem.FileName.split('.');
            if (this.imageFileExtension.indexOf(fileNameArr[fileNameArr.length - 1]) > -1) {
              if (!item.img) {
                item.img = [];
              }
              item.img.push(secItem);
            } else {
              if (!item.file) {
                item.file = [];
              }
              item.file.push(secItem);
            }
          });
        }
      });
    },
    removeAllChild(ele) {
      while (
        ele.hasChildNodes() // 当div下还存在子节点时 循环继续
      ) {
        ele.removeChild(ele.firstChild);
      }
    },
    preventDefault(e) {
      // if(e.target.tagName.toLowerCase()!=='textarea' &&
      //     !$(e.target).hasClass('sns-main') &&
      //     $(e.target).parent('.sns-main').length==0
      // ){
      //     e.preventDefault();
      // }
      e.preventDefault();
    },
    removePreventDefault() {
      document.removeEventListener('touchmove', this.preventDefault, false);
      // this.hScroll.destroy();
    },
    // 添加评论
    toggleToComment() {
      const that = this;
      this.showComment = true;
      // $('.sns-comment').css('opacity',1);
      $('.sns-comment')
        .removeClass('slideOutDownComment')
        .addClass('slide slideInUpComment');
      document.getElementById('comment').focus();

      // $('.sns-main').children('div').css('transition-property', 'transform')
      // .css('transition-timing-function', 'cubic-bezier(0.165, 0.84, 0.44, 1)')
      // .css('transition-duration','0ms')
      // .css('transform', 'translate(0px, 0px) translateZ(0px)');
      // 禁止滚动
      // document.addEventListener('touchmove',that.preventDefault,false);
      // document.getElementById('comment').addEventListener('scroll',function(){
      //     console.log('scroll');
      // });
      document.addEventListener('touchmove', that.preventDefault, false);
      // this.$refs.snsMain.addEventListener('touchmove',function(e){
      //     console.log(e);
      // },false);
      this.hScroll = new BScroll(this.$refs.snsMain, {
        probeType: 3,
        click: false,
        preventDefault: true,
      });
    },
    toggleSelected() {
      this.optionSelected = !this.optionSelected;
    },
    hideComment() {
      this.showComment = false;
      $('.sns-comment')
        .removeClass('slideInUpComment')
        .addClass('slideOutDownComment');
      // this.initCommentPanel();
      this.removePreventDefault();
    },
    refreshSnsDatas(schemaCode, bizObjectId, pageIndex) {
      this.hasMore = false;
      this.itemDatas = [];
      this.getSnsData(schemaCode, bizObjectId, pageIndex);
    },
    doRefresh() {
      this.pageIndex = 0;
      this.refreshSnsDatas(this.schemaCode, this.bizObjectId, this.pageIndex);
    },
    refresh(done) {
      this.doRefresh();
      done();
    },
    infinite(done) {
      if (!this.hasMore) {
        setTimeout(() => {
          this.$refs.myscroller && this.$refs.myscroller.finishInfinite(2);
        }, 0);
        // return false;
      } else {
        this.hasMore = false;
        if (this.itemDatas.length > 0 && this.itemDatas.length < this.count) {
          this.pageIndex = Math.ceil(this.itemDatas.length / 10);
          this.getSnsData(this.schemaCode, this.bizObjectId, this.pageIndex);
        }
        if (this.$refs.myscroller) {
          this.$refs.myscroller.resize();
        }
        done();
      }
    },
    initFileUpload() {
      const that = this;
      const uploadPic = new UploadPic();
      uploadPic.init({
        input: document.querySelector('.file-upload'),
        display: document.querySelector('.filelist'),
        callback: (base64, type, fileId, fileName) => {
          $.ajax({
            url: `${baseUrl}/SNS/UploadBase64File`,
            data: {
              image: base64,
              type,
              fileId,
              name: fileName,
            },
            type: 'post',
            dataType: 'json',
            success: () => {
              that.canSend = true;
              $('.filelist')
                .find('.img-container:last')
                .focus();
            },
          });
        },
      });
    },
    initCommentPanel() {
      this.snsText = '';
      this.removeAllChild(this.$refs.filelist);
    },
    submit() {
      if (this.snsText === '') {
        H3PluginDeveloper.IShowWarn('请先输入动态内容');
        return;
      }
      const fileList = document.querySelector('.filelist');
      for (let i = 0, len = fileList.children.length; i < len; i += 1) {
        this.fileIds += `${fileList.children[i].children[0].id},`;
      }
      this.fileIds = this.fileIds.substring(0, this.fileIds.length - 1);
      this.addSnsContentPost(this.snsText, this.fileIds, this.schemaCode, this.bizObjectId);
      this.fileIds = '';
    },
    async addSnsContentPost(text, fileIds, schemaCode, bizObjectId) {
      const data = await addSnsPost(text, fileIds, schemaCode, bizObjectId);
      if (data.Successful) {
        H3PluginDeveloper.IShowSuccess('发送成功');
        // 通知刷新数据
        const newSns = {
          PostId: data.ReturnData.PostId,
        };
        this.$root.eventHub.$emit('Sns-Added', newSns);
        $('.sns-comment')
          .removeClass('slideInUpComment')
          .addClass('slideOutDownComment');
        this.showComment = false;
        this.initCommentPanel();
        this.removePreventDefault();
      }
    },
    showIcon(file) {
      let suffix = '';
      const tmp = file.FileName.split('.');
      if (tmp.length > 1) {
        suffix = tmp[1];
        if (suffix === 'doc' || suffix === 'docx') {
          return 'icon-word';
        } else if (suffix === 'xls' || suffix === 'xlsx') {
          return 'icon-excel';
        } else if (suffix === 'pdf') {
          return 'icon-pdf';
        }
        return 'icon-weizhi';
      }
      return 'icon-weizhi';
    },
    previewAttach(file) {
      // TODO 文件预览 --微信禁用
      if (!isDingtalk) {
        return;
      }
      // 判断是否支持预览该类型附件
      const suffix = file.FileName.substr(file.FileName.indexOf('.'));
      if (suffix) {
        if (this.docExtension.indexOf(suffix) > -1) {
          this.requestPreviewFileUrl(file.ObjectId);
        } else {
          H3PluginDeveloper.IShowError('不支持预览的附件类型');
        }
      } else {
        H3PluginDeveloper.IShowError('不支持预览的附件类型');
      }
    },
    async requestPreviewFileUrl(fileId) {
      H3PluginDeveloper.IShowPreLoader('正在生成预览文件...');
      const res = await getSnsPreviewFileUrl(fileId);
      if (res) {
        H3PluginDeveloper.IHidePreLoader();
        const htmlUrl = res.htmlUrl;
        if (htmlUrl) {
          previewAttachment(htmlUrl);
        }
      } else {
        H3PluginDeveloper.IHidePreLoader();
      }
    },
    comment() {
      // 跳转至写评论页
      this.$router.push({
        name: 'snscomment',
        params: {
          schemaCode: this.schemaCode || window.GlobalConfig.schemaCode,
          bizObjectId: this.bizObjectId || this.responseContext.BizObjectId,
        },
      });
    },
  },
  mounted() {
    const that = this;
    setTimeout(() => {
      that.ready = true;
      // that.initFileUpload();
    }, 300);
  },

  activated() {
    const self = this;
    setTitle(`${self.title}(${self.count})`);
    window.backFn = () => {
      self.goBack();
    };
    setLeft(window.backFn);
  },
  watch: {
    count() {
      setTitle(`${this.title}(${this.count})`);
    },
  },
};
</script>

<style lang="less" >
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}

.sns-wrapper {
  height: 100%;
  // .bd-bot {
  //   width: 100%;
  //   border: 0 !important;
  //   background-image: -webkit-linear-gradient(0deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
  //   background-image: linear-gradient(0deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
  //   background-size: 100% 1px;
  //   background-repeat: no-repeat;
  //   background-position: bottom;
  // }
  .bd-top {
    width: 100%;
    border: 0 !important;
    background-image: -webkit-linear-gradient(0deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
    background-image: linear-gradient(0deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: top;
  }
  .snslist {
    // margin-top: 46px;
    position: absolute;
    top: 0;
    .px2rem(bottom,98);
    width: 100%;
    .sns-item {
      display: flex;
      background-color: #fff;
      .px2rem(margin-bottom,8);
      .px2rem(padding-left,24); //   .px2rem(padding-right,24);
      // &.has-border {
        // border-bottom: 1px solid #d9d9d9;
      // }
      //    &:last-child{
      //        padding-left: 0;
      //    }
      div.item-wrapper {
        display: flex;
        .px2rem(padding-top,30);
        // .px2rem(padding-bottom,30);
        .px2rem(padding-right,24);
        width: 100%;
        align-items: flex-start; // border-bottom: 1px solid #d9d9d9;
        &.no-border {
          border-bottom: 0;
        }
        .item-avator {
          flex-shrink: 0;
          .px2rem(width,80);
          .px2rem(height,80);
          text-align: center;
          img,
          div {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          div {
            .px2rem(line-height,80);
            background-color: #38adff;
            color: #fff;
          }
        }
        .item-content {
          overflow: hidden;
          .px2rem(padding-left,26);
          .px2rem(padding-right,26);
          .item-name {
            .px2rem(font-size,30);
            .px2rem(margin-bottom,12);
            color: #333;
          }
          .item-files {
            .file-box-wrap {
              .px2rem(margin-right,-10);
              .px2rem(margin-top,20);
              .file-box {
                display: flex;
                .px2rem(height,80);
                .px2rem(padding-top,16);
                .px2rem(padding-bottom,16);
                align-items: center;
                position: relative;
                border-top: 1px solid #ebebeb;
                .file-main {
                  .px2rem(margin-right,27.5);
                  z-index: 1;
                  .icon-document {
                    .px2rem(font-size,59.5);
                    color: #108ee9;
                  }
                  .file-bg {
                    .px2rem(width,80);
                    .px2rem(height,80);
                    // width: 100%;
                    // height: 100%;
                    .px2rem(font-size,80);
                  }
                  .attachImg{
                    .px2rem(width,80);
                    .px2rem(height,80);
                  }
                }
                .file-box-right {
                  .px2rem(width,636);
                  display: flex;
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
                      color: #333;
                      // .px2rem(height,40);
                      // .px2rem(line-height,40);
                      .px2rem(font-size,28);
                    }
                    .file-size {
                      color: #999;
                      .px2rem(font-size,24);
                      // .px2rem(height,30);
                      // .px2rem(line-height,30);
                    }
                  }
                }
                .no-border {
                  border: none;
                }
              }
            }
            .px2rem(margin-bottom,14);
            img {
              .px2rem(width,130);
              .px2rem(height,130);
              .px2rem(border-radius,6);
              .px2rem(margin-right,15);
            }
            img:nth-child(4n) {
              .px2rem(margin-right, 0);
            }
          }
          .item-comment {
            .px2rem(font-size,30);
            color: #333;
            .px2rem(margin-bottom,16);
            .px2rem(margin-top,23);
          }
          .item-time {
            .px2rem(font-size,24);
            color: #ccc;
          }
        }
      }
    }
  }
  .sns-reply {
    position: fixed;
    bottom: 0;
    background-color: #fdfdfd;
    display: flex;
    align-items: center;
    width: 100%;
    .px2rem(height,98);
    .px2rem(line-height,98);
    .px2rem(padding-left,24);
    div {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span {
      .px2rem(font-size,34);
      color: #999;
    }
  }
  div.img-container {
    .px2rem(width,90);
    .px2rem(height,90);
    .px2rem(margin-right,20);
    .px2rem(margin-top,20);
    position: relative;
    float: left;
    span {
      position: absolute;
      top: -5px;
      right: -5px;
    }
    img {
      .px2rem(width,90);
      .px2rem(height,90);
    }
  }
  .comment-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 9998;
    width: 100%;
    background: #999;
    opacity: 0.5;
  }
  .sns-comment {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 9999;
    background: #fff;
    .sns-main {
      position: relative;
      background: #fff; // margin-top: 46px;
      .px2rem(padding-left,24);
      .px2rem(padding-right,24);
      .px2rem(max-height,380); // overflow-y:auto;
      overflow: hidden;
      textarea {
        width: 100%;
        .px2rem(min-height,80);
        height: auto;
        border: none;
        color: #333;
        .px2rem(font-size,34);
        .px2rem(padding-top,10);
        outline: none;
        resize: none;
      }
      div.filelist {
        // .px2rem(margin-top,30);
        overflow: hidden;
        padding: 10px 0;
        img {
          .px2rem(width,90);
          .px2rem(height,90);
        }
        .icon-mistake:before {
          color: #d9d9d9 !important;
        }
      }
    }
    .sns-buttons {
      position: relative;
      width: 100%;
      // bottom: 0;
      .sns-option {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .px2rem(height,42);
        .px2rem(font-size,30);
        color: #000;
        .px2rem(margin-left,24);
        .px2rem(margin-bottom,13);
        span:before {
          .px2rem(font-size,40);
        }
      }
      div.trigger {
        position: relative;
        display: flex !important;
        align-items: center;
        .px2rem(height,88);
        .px2rem(padding-left,24);
        .px2rem(padding-right,24);
        background: rgba(255, 255, 255, 0.85);
        div:first-child {
          // flex-basis: 10%;
          text-align: left;
          display: flex;
          span {
            .px2rem(font-size,50);
            position: absolute;
            color: #999;
          }
        }
        div:last-child {
          position: absolute;
          top: 0;
          right: 0;
          .px2rem(width,120);
          .px2rem(height,88);
          .px2rem(line-height,88);
          text-align: center; // flex-basis: 30px;
          // flex-shrink: 0;
          // text-align: center;
          // flex-grow: 2;
          span {
            .px2rem(font-size,32);
            color: #108ee9;
          }
        }
      }
    }
  }
  .slide {
    transition: transform 0.3s ease-in-out;
  }
  .slideInUpComment {
    transform: translate3d(0, 0, 0);
  }
  .slideOutDownComment {
    transform: translate3d(0, 100%, 0);
  }
  .empty-container {
    .px2rem(margin-top,336);
    width: 100%;
    text-align: center;
    img {
      .px2rem(width,270);
      .px2rem(height,280);
    }
    div.message {
      .px2rem(margin-top,50);
      .px2rem(font-size,28);
      color: #999;
    }
  }
  span.icon-reset:before {
    background-color: #fff !important;
    border-radius: 50%;
  }
  .send-comments {
    position: fixed !important;
    bottom: 0;
    left: 0;
    width: 100%;
    color: #1890ff;
  }
}
[v-cloak] {
  display: none;
}
</style>
