<template>
  <div class="sns-comment">
    <layout title="写评论">
      <div class="comment-zone">
        <at
          ref="comment"
          v-model="html"
          class="comment-wrap"
          :members="members"
          :embeddedItemTemplate="embeddedItemTemplate"
          :maxlength="maxlength"
          nameKey="name"
          @inputAt="inputAt"
        >
          <div
            ref="atwhoEditWrap"
            placeholder="写评论"
            class="needsclick atwho-edit-wrap dp-font34"
            tabindex="0"
            contenteditable="true"
          >
          </div>
        </at>
        <div class="comment-zone__btn">
          <span class="btn__mention dp-font32" @click="inputAt">@</span>
          <p class="dp-font32">
            {{ atWordsCount }}/2000
          </p>
        </div>
      </div>
      <div class="add-pic-wrap">
        <div class="add-head add-pic-head">
          <div class="left">
            <i class="dp-font34">图片</i>
            <p v-if="choosePicCounts === 0" class="dp-font34">
              最多支持8张
            </p>
            <p v-else class="dp-font34">
              已选{{ choosePicCounts }}张图片
            </p>
          </div>
        </div>
        <div ref="filelist" class="filelist">
          <div class="img-container addNewPic">
            <h3-upload
              v-model="fileList"
              :action="action"
              :limit="8"
              :maxSize="maxSize"
              :processFile="onprocessFile"
              :format="accessSuffixSolve"
              :base64="['image']"
              multiple
              @fileClick="showImageViewer"
              @oversize="onOversize"
              @error="onUploadError"
            />
          </div>
        </div>
      </div>
      <h3-button
        class="send-comments"
        :style="{color: choosePicCounts > 0 || html ? '#1890FF' : '#999999'}"
        @click="submit"
      >
        <span class="h3yun_All check"></span>
        发送
      </h3-button>
    </layout>
    <h3-org-select
      v-if="pickerShow"
      ref="selectedUserPage"
      :org="treeNodes"
      :searchData="searchList"
      :isMulpitle="false"
      :selectUser="true"
      :selectOrg="false"
      :realTimeSearch="true"
      :show="pickerShow"
      @ok="ok"
      @onSearch="onSearch"
    />
  </div>
</template>

<script>
import { baseUrl } from '../../config/env';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { addSnsPost, getCommentMentionUser, searchUser } from '../../service/get-data';
import { H3Org, H3Button } from 'h3-mobile-vue';
import { H3Upload } from '@h3/thinking-ui';
import At from '../../components/vue-at/at.vue';

export default {
  name: 'snscomment',
  components: {
    H3Button,
    H3OrgSelect: H3Org.select,
    At,
    H3Upload,
  },
  data () {
    return {
      comments: '',
      fileIds: '',
      wordsCount: 0,
      // 表单id
      bizObjectId: null,
      // 应用id
      schemaCode: null,
      // form页面跳转到评论
      preRoute: null,
      canInitAddPic: true,
      imageFileExtension: ['png', 'bmp', 'jpg', 'jpeg', 'gif'],
      action: {
        target: `${baseUrl}/SNS/UploadBase64File`,
        fileName: 'fileToUpload',
        data: (fileObj) => {
          return {
            name: fileObj.name,
            type: fileObj.type,
            fileId: fileObj.fileId,
            image: fileObj.base64,
          };
        },
      },
      fileList: [],
      maxSize: 10 * 1024 * 1024,
      members: [],
      treeNodes: [],
      searchList: [],
      html: '',
      pickerShow: false,
      // metionedUsers: [],
      metionedIndex: [],
      userVisible: true,
      orgUnitVisible: false,
      isSubmiting: false,
      atClickTrigger: false,
      maxlength: 2000,
    };
  },
  computed: {
    // todo 如果表单修改了拥有者，此时在获取@人员，uid已经传到后端，接口应该返回排除拥有者，但是接口返回有问题
    // getAllowedMentionUsers, addSnsContentPost
    ownerId () {
      return this.$store.state.Form.ViewModel[this.bizObjectId].$responseContext.ReturnData.OwnerId.Value[0].UnitId;
    },
    atWordsCount () {
      return this.html.length;
    },
    isEmptyContent () {
      return this.html.length === 0 && this.choosePicCounts === 0;
    },
    choosePicCounts () {
      const successList = this.fileList.filter(file => {
        return file.status === 'success';
      });
      return successList.length;
    },
  },
  created () {
    this.$store.state.isClickCommentButton = true;
    this.schemaCode = this.$route.params.schemaCode;
    this.bizObjectId = this.$route.params.bizObjectId;
    this.preRoute = this.$route.params.preRoute;
  },
  methods: {
    showImageViewer (file, files) {
      if (file.category !== 'image') {
        return;
      }
      const _files = files.filter(_file => _file.category === 'image');
      this.$imageviewer.show({
        index: _files.findIndex(_file => _file.uid === file.uid),
        images: _files.map(_file => {
          return {
            title: '',
            url: _file.url,
          };
        }),
      });
    },
    onOversize (selecFile, files) {
      H3PluginDeveloper.IShowWarn(`文件【${selecFile[0].name.slice(0, 5)}】：单次上传文件不超过10M`);
    },
    onprocessFile (fileObj) {
      if (this.isSpecialImage(fileObj.file)) {
        fileObj.category = 'image';
        fileObj.name = fileObj.name + '.jpg';
        fileObj.type = 'image/jpg';
      }

      fileObj.fileId = H3PluginDeveloper.IGuid();
      return fileObj;
    },
    onUploadError () {
      H3PluginDeveloper.IShowWarn('图片上传失败');
    },
    embeddedItemTemplate (item) {
      return `<span data-at-value="${item.key}" class="at-user">${item.name}</span>`;
    },
    inputFocus () {
      this.$refs.outText.focus();
      this.$emit('input');
    },
    blur () {
      // 过滤掉表情符合
      this.filterEmoji();
    },
    filterEmoji () {
      this.html = this.html.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D]|\\n)/g, '');
      // 转义引号
      this.html = this.html.replace(/\\/g, '&nbsp;');
    },
    trim (str, isGlobal) {
      let result = str.replace(/(^\s+)|(\s+$)/g, '');
      if (isGlobal.toLowerCase() === 'g') {
        result = result.replace(/\s/g, '');
      }
      return result;
    },
    submit () {
      if (this.isSubmiting) return;
      this.isSubmiting = true;
      this.filterEmoji();
      // 校验是否为空
      if (this.html === '' && this.fileList.length === 0) {
        H3PluginDeveloper.IShowWarn('请先输入动态内容或者添加图片');
        this.isSubmiting = false;
        return;
      }

      if (this.fileList.length > 0) {
        // 校验图片是否正在上传
        const filterRes = this.fileList.filter(file => {
          return file.status === 'ready' || file.status === 'uploading';
        });

        if (filterRes.length > 0) {
          H3PluginDeveloper.IShowTip('图片正在上传中，请稍等');
          this.isSubmiting = false;
          return;
        }
        // 校验图片是否有上传失败
        const filterError = this.fileList.filter(file => {
          return file.status === 'error';
        });

        if (filterError.length > 0) {
          H3PluginDeveloper.IShowTip('请删除或重新上传图片');
          this.isSubmiting = false;
          return;
        }
      }

      // 获取上传的图片的field
      for (let i = 0; i < this.fileList.length; i++) {
        this.fileIds += this.fileList[i].result.fileid + ',';
      }
      this.fileIds = this.fileIds.replace(/,$/, '');
      this.schemaCode = this.$route.params.schemaCode;
      this.bizObjectId = this.$route.params.bizObjectId;
      const html = this.handleAtwhoWrap(this.$refs.atwhoEditWrap).innerHTML;
      // this.addSnsContentPost(this.unhtml(html), this.fileIds, this.schemaCode, this.bizObjectId);
      this.addSnsContentPost(html, this.fileIds, this.schemaCode, this.bizObjectId);
      this.fileIds = '';
    },
    unhtml (value) {
      return value.replace(/"/g, '\\"');
      // value = value.replace(/&/g, '&amp;');
      // value = value.replace(/</g, '&lt;');
      // value = value.replace(/>/g, '&gt;');
      // value = value.replace(/ /g, '&nbsp;');
      // value = value.replace(/"/g, '&quot;');
      // return value;
    },
    getMentionedUserIds () {
      const ids = [];
      const wrap = document.querySelector('.atwho-edit-wrap');
      const atUserDoms = wrap.getElementsByClassName('at-user');
      for (let i = 0; i < atUserDoms.length; i++) {
        const atUser = atUserDoms[i];
        if (atUser) {
          const temp = atUser.getAttribute('data-at-value');
          if (temp) {
            ids.push(temp);
          }
        }
      }
      return ids.join(';');
    },
    getNotificationContent () {
      const node = this.handleAtwhoWrap(this.$refs.atwhoEditWrap);
      return node.innerText;
    },
    // todo 评论的接口为什么要传userid， ownderid呢
    async addSnsContentPost (text, fileIds, schemaCode, bizObjectId) {
      const userIds = this.getMentionedUserIds();
      const notificationContent = this.getNotificationContent();
      const data = await addSnsPost(text, fileIds, schemaCode, bizObjectId, this.ownerId, notificationContent, userIds);
      if (data.Successful) {
        H3PluginDeveloper.IShowSuccess('发送成功');
        // 通知刷新数据
        const newSns = {
          PostId: data.ReturnData.PostId,
        };
        this.$root.eventHub.$emit('Sns-Added', newSns);
        // 跳转至评论列表页
        if (this.preRoute === 'form') {
          this.$router.replace({
            name: 'snslist',
            params: {
              schemaCode: this.schemaCode || window.GlobalConfig.schemaCode,
              bizObjectId: this.bizObjectId || this.responseContext.BizObjectId,
            },
          });
        } else {
          this.$router.go(-1);
        }
      }
      this.isSubmiting = false;
    },
    inputAt (ev) {
      this.$refs.atwhoEditWrap.blur();
      if (ev) {
        // 说明用户进入的是通过键盘触发@按钮
        this.atClickTrigger = true;
      }
      this.getAllowedMentionUsers();
    },
    async getAllowedMentionUsers () {
      const result = await getCommentMentionUser(this.schemaCode, this.ownerId);
      if (result.Successful) {
        this.members = result.ReturnData.Users.map(user => {
          return {
            value: user.UnitID,
            name: user.DisplayName,
          };
        });

        this.treeNodes = this.resetTree(result.ReturnData.Users, []);
        this.pickerShow = true;
        this.backStack.push(() => {
          this.pickerShow = false;
        });
      } else {
        H3PluginDeveloper.IShowError('提示', result.ErrorMessage);
      }
    },
    // 组装接口异步数据
    resetTree (nodes, orgTree) {
      const nodeTypes = {
        1: 'company', // 公司
        2: 'org', // 部门
        4: 'user', // 用户
        8: 'org', // 角色
      };
      nodes.forEach((node) => {
        const name = node.DisplayName || node.Name;
        if (!name) {
          return;
        }
        node.UnitID = node.UnitID || node.ObjectId;
        orgTree.push({
          id: node.UnitID || node.ObjectId,
          key: node.UnitID || node.ObjectId,
          name: node.DisplayName || node.Name,
          avatar: node.Icon || node.Avatar || '',
          type: 'user',
          hasChild: false,
          orglist: node.DisplayName || node.Name,
          title: node.DisplayName || node.Name,
          isLeaf: false,
          ParentId: '',
          children: [],
          source: node,
        });
      });
      return orgTree;
    },
    ok (items) {
      if (!items.length) {
        H3PluginDeveloper.IShowWarn('提示', '请选择要@的人');
        return;
      }
      this.pickerShow = false;

      if (this.atClickTrigger) {
        this.html = this.html + `<span data-at-embedded contenteditable="false">${this.embeddedItemTemplate(items[0])}</span>&nbsp;`;
      } else {
        this.$refs.comment.insertItem(items[0]);
      }
      this.atClickTrigger = false;
      this.backStack.pop();
    },
    async onSearch (name) {
      name = name.replace(/^\s+|\s+$/gm, '');
      if (!name) {
        return;
      }
      this.searchList = this.treeNodes.filter((user) => {
        return user.name.indexOf(name) > -1;
      });
    },
    handleAtwhoWrap (wrap) {
      const node = wrap.cloneNode(true);
      const atUserDoms = node.getElementsByClassName('at-user');
      for (let i = 0; i < atUserDoms.length; i++) {
        const atUser = atUserDoms[i];
        if (atUser) {
          atUser.innerText = `@${atUser.innerText}`;
        }
      }
      return node;
    },
    accessSuffixSolve (file) {
      if (this.isSpecialImage(file)) {
        return true;
      }

      const temp = file.name.split('.');
      const suffix = temp[temp.length - 1].toLowerCase();
      if (!this.imageFileExtension.includes(suffix)) { // 存在不是图片的需要提示出来
        H3PluginDeveloper.IShowSuccess('只能上传图片!');
      }
      return this.imageFileExtension.includes(suffix);
    },
    isSpecialImage (file) {
      const temp = file.name.split('.');
      const suffix = temp.pop().toLowerCase();
      if (suffix === file.name &&
        ((/^mmexport\d+$/).test(suffix) || /^wx_camera_\d+$/.test(suffix))) {
        return true;
      }
      return false;
    },
  },
  beforeRouteLeave (to, from, next) {
    this.$store.state.excludeComp = ['snscomment'];
    next();
  },
};
</script>

<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
@font-color-blue: #108ee9;
@font-color9: #999999;

.sns-comment {
  .comment-zone {
    width: 100%;
    .px2rem(padding, 30);
    box-sizing: border-box;
    background: #fff;

    textarea {
      width: 100%;
      .px2rem(height, 230);
      color: #333;
      .px2rem(font-size, 34);
    }
    .atwho-edit-wrap {
      font-size: inherit;
      .px2rem(height, 230);
      overflow-y: auto;
      outline: none;
      -webkit-user-modify: read-write-plaintext-only;
      .at-user {
        &::before{
          content: '@'
        }
        color: #107FFF;
      }
      &:empty:before{content: attr(placeholder);color:#bbb;}
      &:focus{content:none;}
    }
  }
  .comment-zone__btn {
    display: flex;
    align-items: center;
    .btn__mention {
      color: #107FF0;
      .px2rem(width, 100);
    }
    p {
      flex:1;
      text-align: right;
      color: #ccc;
      .px2rem(font-size, 24);
    }
  }

  .comment-wrap{
    white-space: pre-wrap;
  }

  .add-pic-wrap {
    background-color: white; // margin-top: .24rem;
    .px2rem(margin-top, 24);
    .add-head {
      // height: 1rem;
      .px2rem(height, 90);
      display: flex;
      justify-content: space-between; // padding: 0 .52rem 0 .26rem;
      .px2rem(padding-right, 30);
      .px2rem(padding-left, 30);
      align-items: center;
      position: relative;
      .left {
        display: flex;
        align-items: center;
      }
      p {
        display: inline-block; // margin-left: .16rem;
        .px2rem(margin-left, 184);
        color: #999;
      }
      span {
        // font-size: .5rem;
        .px2rem(font-size, 34);
        color: #999;
      }
      i {
        color: #333;
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
  }

  .filelist {
    .px2rem(margin-top, -32);
    overflow: hidden;
    .px2rem(padding, 30);
    padding-top: 0;
    img {
      .px2rem(width, 136);
      .px2rem(height, 136);
    }
    .icon-mistake:before {
      color: #d9d9d9 !important;
    }
  }

  .img-container {
    /* .px2rem(width,136); */
    /* .px2rem(height,136); */
    .px2rem(margin-right,42);
    .px2rem(margin-top,32);
    position: relative;
    float: left;
    img {
      .px2rem(width, 136);
      .px2rem(height, 136);
    }
  }

  .img-container:nth-child(4n) {
    .px2rem(margin-right, 0);
  }

  span.icon-reset:before {
    background-color: #fff !important;
    border-radius: 50%;
    .px2rem(font-size, 32);

  }

  .send-comments {
    position: fixed !important;
    bottom: 0;
    left: 0;
    width: 100%;
    color: #1890ff;
    .check {
      .px2rem(padding-right, 20);
    }
  }

  .addNewPic{
    .px2rem(font-size, 64);
    border-radius: 6px;
    text-align: center;
    .px2rem(line-height, 136);
  }
}

.editor{
    height: 200px;
    overflow: auto;
    white-space: pre-wrap;
    border: solid 2px rgba(0,0,0,.5);
}

</style>
