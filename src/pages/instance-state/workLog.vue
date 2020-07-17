<template>
  <div class="work-log">
    <div :class="{'isTopShow': isLight}" class="work-log-wrapper">
      <div class="approval-tline-box">
        <div class="approval-tline ">
          <div
            v-for="(activity, index) of groupWorkItems"
            :key="activity.key"
            class="time-node"
          >
            <div class="node-status">
              <img
                :src="getApproveImg(activity)"
                class="action-icon"
              />
            </div>
            <div class="nodebox">
              <div
                :class="{border: (activity.todoUsers.length !== 0 && activity.collapse) && activity.finishedItems.length !== 0}"
                class="activity-top"
              >
                <span
                  class="activity-name"
                >{{ activity.name }}</span>
                <div
                  :style="{color: statusColor[activity.status]}"
                  class="activity-status"
                >
                  <div
                    class="activity-status-label"
                    @click="toggleTodoUsers(activity)"
                  >
                    <span
                      v-if="activity.itemType !== 3"
                      :style="{color: statusColor[activity.status - 1]}"
                    >{{ activity.statusText }}</span>
                    <span
                      v-if="activity.itemType === 3 && activity.todoUsers.length > 0"
                      :style="{color: statusColor[0]}"
                    >{{ activity.statusText }}</span>
                    <span
                      v-if="activity.itemType === 3 && activity.todoUsers.length === 0"
                      :style="{color: statusColor[1]}"
                    >{{ activity.statusText }}</span>
                    <span
                      v-show="activity.key !== 999 && activity.value.length > 0"
                      :class="[!activity.collapse ? 'expand' : '']"
                      class="icon h3yun_All right-o"
                    ></span>
                  </div>
                </div>
              </div>
              <div
                v-show="activity.value.length > 0 && !activity.collapse"
                class="activity-todo"
                :style="{border: (activity.value.length === 0 || activity.value.length !== 0 && activity.finishedItems.length === 0) ? 'none' : ''}"
              >
                <div
                  v-for="(item,index) in activity.finishedItems"
                  :key="'a' + index"
                  class="user-wrapper"
                  @click="showUserInfo(item.dingtalkAccount || item.DingTalkAccount)"
                >
                  <img
                    v-if="item.UserProfilePhotoUrl || item.ProfilePhotoUrl"
                    :src="item.UserProfilePhotoUrl || item.ProfilePhotoUrl"
                    alt="图片"
                  />
                  <div
                    v-if="!item.UserProfilePhotoUrl && !item.ProfilePhotoUrl"
                    class="user-img dp-font28"
                    :style="{background: Colors[index % 5]}"
                  >
                    {{ item && getUserDisplayName(item.UserName) }}
                  </div>
                  <div class="user-name">
                    {{ item.UserName }}
                  </div>
                  <div class="img-status">
                    <img :src="getStatusImage(item)" />
                  </div>
                </div>
                <div
                  v-for="(item,index) in activity.cancelItems"
                  :key="'b' + index"
                  class="user-wrapper"
                  @click="showUserInfo(item.dingtalkAccount || item.DingTalkAccount)"
                >
                  <img
                    v-if="item.UserProfilePhotoUrl || item.ProfilePhotoUrl"
                    :src="item.UserProfilePhotoUrl || item.ProfilePhotoUrl"
                    alt="图片"
                  />
                  <div
                    v-if="!item.UserProfilePhotoUrl && !item.ProfilePhotoUrl"
                    class="user-img dp-font28"
                    :style="{background: Colors[index % 5]}"
                  >
                    {{ item && getUserDisplayName(item.UserName) }}
                  </div>
                  <div class="user-name">
                    {{ item.UserName }}
                  </div>
                  <div class="img-status">
                    <img :src="getStatusImage(item)" />
                  </div>
                </div>
                <div
                  v-for="(user,index) in activity.todoUsers"
                  :key="index"
                  class="user-wrapper"
                  @click="showUserInfo(user.dingtalkAccount || user.DingTalkAccount)"
                >
                  <img
                    v-if="user.url || user.ProfilePhotoUrl"
                    :src="user.url || user.ProfilePhotoUrl"
                    alt="图片"
                  />
                  <div
                    v-if="!user.url && !user.ProfilePhotoUrl"
                    class="user-img dp-font28"
                    :style="{background: Colors[index % 5]}"
                  >
                    {{ user && getUserDisplayName(user.name) }}
                  </div>
                  <div class="user-name">
                    {{ user.name }}
                  </div>
                  <div class="img-status">
                    <img :src="getWorkingImg()" />
                  </div>
                </div>
              </div>
              <div class="activity-nodes">
                <!-- item.state==6:转交 -->
                <div
                  v-for="(item,index) in getFinishedItems(activity)"
                  :key="'c' + index"
                  class="item-nodes"
                >
                  <div
                    v-if="item.State === 2 || item.State === 6 || item.State === 4 || item.TokenState === 3 || item.TokenState === 2"
                    class="item-head"
                  >
                    <div
                      class="user-wrapper"
                      style="margin-left: 0; margin-bottom: 0;"
                      @click="showUserInfo((item.TokenState === 2 || item.TokenState === 3) ? item.FinisherDingTalkAccount : item.DingTalkAccount)"
                    >
                      <img
                        v-if="getUserProfilePhotoUrl(item)"
                        :src="getUserProfilePhotoUrl(item)"
                      />
                      <div
                        v-else
                        class="user-img"
                        :style="{background: Colors[index % 5]}"
                      >
                        {{ getUserDisplayName( item.FinisherName && (item.TokenState === 3 || item.TokenState === 2) ? item.FinisherName : item.UserName ) }}
                      </div>
                      <!-- <div class="img-status">
                        <img :src="getStatusImage(item)" />
                      </div> -->
                      <div class="user-name">
                        {{ item.FinisherName && (item.TokenState === 3 || item.TokenState === 2) ? item.FinisherName : item.UserName }}
                      </div>
                    </div>
                    <div class="item-user">
                      <div class="item-top">
                        <div
                          class="item-wf-status"
                          :style="{color: getWorkItemStatusColor(item)}"
                        >
                          {{ getWorkItemStatus(item) }}
                        </div>
                        <div class="item-handletime">
                          {{ getFormatFinishedTime(item.FinishTime) }}
                        </div>
                      </div>
                      <div
                        v-if="getCommentDisplayStatus(item.Comment)"
                        class="item-comment"
                      >
                        <div
                          v-if="getCommentTextDisplayStatus(item.Comment.Text)"
                          class="item-comment-part item-comment-text"
                        >
                          {{ item.Comment.Text }}
                        </div>
                        <div
                          v-if="item.Comment.Signature"
                          class="item-comment-part item-comment-signature"
                        >
                          <img
                            :src="item.Comment.Signature"
                            :style="{width: (sigZoomId === item.WorkItemId && isSigZoom) ? '100%' : ''}"
                            @click="zoomSignature(item.WorkItemId)"
                          />
                        </div>

                        <div
                          v-if="item.Comment && item.Comment.Images.length > 0"
                          class="item-comment-part item-comment-pic"
                        >
                          <img
                            :id="img.code"
                            v-for="(img,index) in item.Comment.Images"
                            :key="index"
                            :src="img.url"
                            @click="previewImage(item.Comment.Images,index)"
                          />
                        </div>
                        <div
                          v-if="item.Comment && item.Comment.Files.length > 0"
                          class="item-comment-part item-comment-file"
                        >
                          <a
                            v-for="file in item.Comment.Files"
                            :key="file.Code"
                            href="javascript:;"
                            class="item-file"
                            @click="previewFile(file)"
                          >
                            <div class="file-icon">
                              <!-- <span class="icon-Shape2"></span> -->
                              <span :class="showIcon(file)"></span>
                            </div>
                            <div class="file-info">
                              <div>{{ file.Name }}</div>
                              <span>{{ getFileSize(file.Size) }}</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 图片预览 -->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Vue, Component, Prop, Emit, Watch,
} from 'vue-property-decorator';
import {
  State, Getter, Mutation, Action, namespace,
} from 'vuex-class';
import { imgBaseUrl, baseUrl } from '../../config/env';
import { isDingtalk } from '../../config/common';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import {
  getPreviewFileUrl,
  GetDownloadFileUUIDs,
} from '@/service/common.service';
import imagepreview from 'h3-mobile-vue/src/plugins/imagepreview';
const FormVM = namespace('Form/ViewModel');
const FormModule = namespace('Form');

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

@Component({
  name: 'workLog',
  components: {},
})
export default class WorkLog extends Vue {
  // 当前数据id
  @FormModule.State('primaryBizObjectId') primaryBizObjectId;

  // 当前表单数据
  @FormModule.State('ViewModel') formList;

  // 获取表单上下文对象
  get responseContext () {
    return this.formList && this.formList[this.primaryBizObjectId].$responseContext;
  }

  // 获取是否氚云3.0
  get isLight () {
    return this.responseContext && this.responseContext.IsLight;
  }

  groupWorkItems: any = [];

  itemStatusColor: string[] = ['#00D495', '#FE6060', '#8893A7'];

  // itemStatusColor: string[] = ['#1DCCA3', '#F06A71', '#d9d9d9'];

  statusColor: string[] = ['#107FF0', '#00D495', '#8893A7', '#FE6060', '#8893A7'];

  // statusColor: string[] = ['#107FF0', '#1DCCA3', '#d6d6d6', '#F06A71'];

  docExtension: string = '.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.txt';

  Colors: string[] = [
    '#4DA9EB',
    '#00B25E',
    '#F19333',
    '#F06065',
    '#5C7197',
    '#9D88BF',
  ];

  previewShow: boolean = false;

  // 预览用的数;

  photos: any = [];

  current: number = 0;

  previewObject: any = {};

  imgPreviewUrlHandler: string = `${baseUrl}/Form/DownloadFileByUUID?corpid=${
    this.$store.state.corpId
  }&uid=`;

  getUUidUrl: string = `${baseUrl}/Form/GetDownloadFileUUIDs/?AttachmentIdStr=`;

  setLeftCallback: any = null;

  imagePreviewer: any = null;

  sigZoomId: string = '';

  isSigZoom: boolean = false;

  created () {
    console.log(this.$route);
    this.groupWorkItems = this.$route.params.groupWorkItems;
  }

  // 撤回取消头像
  getUserProfilePhotoUrl (item) {
    if (item.State === 3) {
      return item.FinishProfilePhotoUrl;
    }
    return item.UserProfilePhotoUrl || item.ProfilePhotoUrl;
  }

  getApproveImg (item) {
    if (item.status === 2) {
      return `${imgBaseUrl}/images/finished-empty.svg`;
    } else if (item.status === 1) {
      return `${imgBaseUrl}/images/working-empty.svg`;
    } else if (item.status === 3) {
      // 取消
      return `${imgBaseUrl}/images/cancel.svg`;
    }
    return `${imgBaseUrl}/images/reject-empty.svg`;
  }

  getWorkingImg () {
    return `${imgBaseUrl}/images/working-empty.svg`;
  }

  getStatusImage (item) {
    if (item.State === 3) {
      return `${imgBaseUrl}/images/cancel.svg`;
    } else if (item.Approval === 1 && !item.Delegant) {
      return `${imgBaseUrl}/images/finished-empty.svg`;
    } else if (item.Approval === 0) {
      return `${imgBaseUrl}/images/reject-empty.svg`;
    } else if (item.Approval === -1) {
      return `${imgBaseUrl}/images/cancel.svg`;
    } else if (item.Delegant) {
      return `${imgBaseUrl}/images/transfer.svg`;
    } else if (item.State === 4) {
      return `${imgBaseUrl}/images/finished-empty.svg`;
    }
    return false;
  }

  // getWorkItemStatus (item) {
  //   if (item.Delegant) {
  //     // for (const workitem of this.ResponseContext.WorkItems) {
  //     //   if (item.Delegant === workitem.UserId) {
  //     //     return `已转交给${workitem.UserName}`;
  //     //   }
  //     // }
  //     return '已转发';
  //   }
  //   if (item.ItemType === 0) {
  //     return '已提交';
  //   } else if (item.ItemType === 2) {
  //     if (item.Approval === 1) {
  //       return '同意';
  //     } else if (item.Approval === 0) {
  //       return '不同意';
  //     }
  //     return '已取消';
  //   } else if (item.ItemType === 9) {
  //     return '已结束';
  //   }
  //   return '已阅';
  // }

  // 处理finished数据
  getFinishedItems (item) {
    // const newItem = JSON.parse(JSON.stringify(item));
    // if (newItem.finishedItems.length > 0) {
    //   if (newItem.status === 5 || newItem.status === 3) {
    //     // 说明是撤回，只取一条就可以
    //     return newItem.finishedItems.splice(0, 1);
    //   } else {
    //     // 正常返回所有完成数据
    //     return newItem.finishedItems;
    //   }
    // }
    const newItem = JSON.parse(JSON.stringify(item));
    if (newItem.finishedItems.length > 0) {
      // 撤回是5， 取消是3， 驳回是4
      // 如果status = 2 代表同意
      if (newItem.status === 5 || newItem.status === 3) {
        const newFinishedArr: any = [];

        const restOne = newItem.finishedItems.find(i => {
          return i.FinisherName;
        });

        newFinishedArr.push(restOne);

        newItem.finishedItems.forEach(_ => {
          if (_.State === 2) {
            newFinishedArr.push(_);
          }
        });
        console.log(newFinishedArr);
        return newFinishedArr;
      } else {
        // 正常返回所有完成数据
        console.log(newItem.finishedItems);
        return newItem.finishedItems;
      }
    }
  }

  getWorkItemStatus (item) {
    if (item.Delegant) {
      return '转交';
    }
    if (item.ItemType === 0) {
      if (item.State === 2) {
        return '提交';
      } else if (item.TokenState === 2) {
        return '取消';
      } else if (item.TokenState === 3) {
        return '撤回';
      }
    } else if (item.ItemType === 2) {
      if (item.Approval === 1) {
        return '同意';
      } else if (item.Approval === 0) {
        return '不同意';
      }
      // 区分取消与撤回
      if (item.TokenState === 2) {
        return '取消';
      } else if (item.TokenState === 3) {
        return '撤回';
      }
    } else if (item.ItemType === 9) {
      return '结束';
    } else if (item.ItemType === 3) {
      return '已阅';
    }
    return '';
  }

  getFormatFinishedTime (times) {
    let time = times;
    time = (new Date(time.replace(/-/g, '/')) as any).Format(
      'yyyy-MM-dd hh:mm',
    );
    return time;
  }

  // getWorkItemStatusColor (item) {
  //   if (item.Approval === 0) {
  //     return this.itemStatusColor[1];
  //   } else if (item.Approval === -1) {
  //     return this.itemStatusColor[2];
  //   }
  //   return this.itemStatusColor[0];
  // }

  getWorkItemStatusColor (item) {
    if (item.Approval === 0 && item.TokenState === 1) {
      // 不同意, 驳回
      return this.itemStatusColor[1];
    } else if ((item.Approval === -1 && item.TokenState === 3) || item.TokenState === 2) {
      // 撤回，还没有同意说法         (approval = -1, tokenstate = 3),
      // 作废  是另外一种不同意，取消  (approval = 0,  tokenstate = 2), 神逻辑。。。
      return this.itemStatusColor[2];
    } else if (item.Approval === 1) {
      // 同意
      return this.itemStatusColor[0];
    }
  }

  getCommentDisplayStatus (comment) {
    if (!comment) {
      return false;
    }
    if (
      (comment.Images && comment.Images.length > 0) ||
      (comment.Files && comment.Files.length > 0)
    ) {
      return true;
    }
    return this.getCommentTextDisplayStatus(comment.Text, comment.Signature);
  }

  getCommentTextDisplayStatus (text, signature) {
    const txt = text.replace(/(^\s*)|(\s*$)/g, '');
    if (txt || signature) {
      return true;
    }
    return false;
  }

  toggleTodoUsers (activitys) {
    const activity = activitys;
    if (activity.key === 999) {
      return;
    }
    activity.collapse = !activity.collapse;
  }

  showUserInfo (dingtalkAccount) {
    if (isDingtalk) {
      if (dingtalkAccount) {
        if (dingtalkAccount.indexOf('.') > -1) {
          H3PluginDeveloper.IShowUserInfo(
            dingtalkAccount.substr(0, dingtalkAccount.indexOf('.')),
            this.$store.state.corpId,
          );
        } else {
          H3PluginDeveloper.IShowUserInfo(
            dingtalkAccount,
            this.$store.state.corpId,
          );
        }
      }
    }
  }

  getUserDisplayName (name) {
    if (name) {
      return name.substr(name.length - 2, 2);
    }
    return '外客';
  }

  previewFile (file) {
    if (!file.Code) {
      return;
    }
    this.$set(file, 'Active', true);
    // TODO 文件预览 --微信禁用
    if (!isDingtalk) {
      return;
    }
    // 判断是否支持预览该类型附件
    const suffix = file.Name.substr(file.Name.indexOf('.'));
    if (suffix) {
      if (this.docExtension.indexOf(suffix) > -1) {
        this.requestPreviewFileUrl(file.Code);
      } else {
        H3PluginDeveloper.IShowError('不支持预览的附件类型');
      }
    } else {
      H3PluginDeveloper.IShowError('不支持预览的附件类型');
    }
  }

  async requestPreviewFileUrl (fileId) {
    H3PluginDeveloper.IShowPreLoader('正在生成预览文件...');
    const res: any = await getPreviewFileUrl(fileId);
    if (res) {
      H3PluginDeveloper.IHidePreLoader();
      const htmlUrl = res.htmlUrl;
      if (htmlUrl) {
        window.dd.biz.util.openLink({
          url: htmlUrl,
          onSuccess () {
            H3PluginDeveloper.IHidePreLoader();
          },
          onFail () {
            H3PluginDeveloper.IHidePreLoader();
          },
        });
      }
    } else {
      H3PluginDeveloper.IHidePreLoader();
    }
  }

  async requestAnalyserOptionsFileUrl (fileId) {
    H3PluginDeveloper.IShowPreLoader('正在生成预览文件...');
    const res: any = await getPreviewFileUrl(fileId);
    if (res) {
      H3PluginDeveloper.IHidePreLoader();
      const htmlUrl = res.htmlUrl;
      if (htmlUrl) {
        window.dd.biz.util.openLink({
          url: htmlUrl,
          onSuccess () {
            H3PluginDeveloper.IHidePreLoader();
          },
          onFail () {
            H3PluginDeveloper.IHidePreLoader();
          },
        });
      }
    } else {
      H3PluginDeveloper.IHidePreLoader();
    }
  }

  previewImage (photos, index) {
    H3PluginDeveloper.IShowPreLoader('正在生成预览图片...');
    const attachmentIds = photos.map(file => {
      return file.code;
    });
    this.current = index;
    this.getUUid(attachmentIds);
  }

  async getUUid (attachmentIds) {
    const attachmentId = attachmentIds.join(';');
    const res = await GetDownloadFileUUIDs(attachmentId);
    if (res) {
      H3PluginDeveloper.IHidePreLoader();
      this.photos = attachmentIds.map(attachmentId => {
        return `${window.location.origin}${this.imgPreviewUrlHandler}${
          res[attachmentId]
        }`;
      });
      this.previewObject = imagepreview({
        images: this.photos,
        index: this.current,
        onClose: () => {
          this.backStack.pop();
        },
      });
      this.backStack.push(() => {
        this.previewObject.$destroy();
      });
    }
  }

  getFileSize (size) {
    const number = size / (1024 * 1024);
    if (number < 1) {
      // 小于1M已kb显示
      return `${(size / 1024).toFixed(1)}Kb`;
    }
    return `${number.toFixed(1)}Mb`;
  }

  showIcon (file) {
    let suffix = '';
    const tmp = file.Name.split('.');
    if (tmp.length > 1) {
      suffix = tmp[1];
      if (suffix === 'doc' || suffix === 'docx') {
        return 'h3yun_All word-file-o';
      } else if (suffix === 'xls' || suffix === 'xlsx') {
        return 'h3yun_All excle-file-o';
      } else if (suffix === 'pdf') {
        return 'h3yun_All pdf-file-o';
      }
      return 'h3yun_All unknow-file-o';
    }
    return 'h3yun_All unknow-file-o';
  }

  zoomSignature (id: string) {
    this.sigZoomId = id;
    this.isSigZoom = !this.isSigZoom;
    if (!this.isSigZoom) {
      this.sigZoomId = '';
    }
  }
}
</script>

<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.work-log {
  height: 100%;
  &-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    .px2rem(top, 88);
    bottom: 0;
    overflow: auto;
    background: #f5f7f9;
    opacity: 0;
    animation: slide 0.3s ease-in 0.1s 1 forwards;
    .h3yun_All {
      color: #8893a7;
    }
  }
  .isTopShow {
    top: 0;
  }
  .activity-nodes {
    overflow: auto;
    // .px2rem(margin-top,26);
    div.item-nodes {
      display: flex;
      .px2rem(padding-top, 38);
      .px2rem(padding-bottom, 10);
      .item-head {
        display: flex;
        width: 100%;
        overflow: hidden;
        .item-avator {
          float: left;
          position: relative;
          .px2rem(width, 44);
          .px2rem(height, 44);
          div.user-name,
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          div.user-name {
            text-align: center;
            .px2rem(line-height, 44);
            color: #fff;
            background: #108ee9;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
          }
          span {
            position: absolute;
            bottom: 0;
            right: 0;
          }
          .img-status {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 17px;
            height: 17px;
          }
        }
        .item-user {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .px2rem(width, 480);
          .item-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .px2rem(margin-top, 2);
          }
          .item-name {
            color: #666;
            .px2rem(font-size, 32);
          }
          .item-wf-status {
            .px2rem(font-size, 24);
          }
        }
        .item-handletime {
          color: #999;
          .px2rem(font-size, 22);
        }
      }
      .item-comment {
        .item-comment-text {
          color: #666;
          .px2rem(font-size, 24);
          .px2rem(padding-top, 16);
          .px2rem(padding-bottom, 10);
          word-break: break-word;
          // .px2rem(margin-bottom,8);
        }
        .item-comment-signature {
          .px2rem(padding, 12);
          img {
            // .px2rem(height, 68);
            .px2rem(width, 180);
            vertical-align: middle;
            transition: width 0.15s ease;
          }
        }
        .item-comment-pic {
          overflow: hidden;
          .px2rem(padding-top, 20);
          .px2rem(padding-bottom, 10);
          border-bottom: 1px solid #eee;
          img {
            .px2rem(width, 140);
            .px2rem(height, 140);
            .px2rem(margin-right, 16);
            .px2rem(margin-bottom, 16);
            float: left;
          }
        }
        .item-comment-file {
          &:last-of-type {
            .item-file {
              border: none;
              padding: 0;
            }
          }
          .item-file {
            width: 100%;
            .px2rem(margin-top, 20);
            .px2rem(padding-bottom, 20);
            background: #fff;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            position: relative;
            &:active {
              background: #f8f8f8;
            }
            .file-icon {
              flex-shrink: 0;
              text-align: center;
              .px2rem(flex-basis, 62);
              .px2rem(height, 62);
              .px2rem(line-height, 62);
              .px2rem(margin-right, 8);
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              // background: #f54335;
              border-radius: 2px;
              span {
                .px2rem(font-size, 60);
              }
            }
            .file-info {
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: center;
              .px2rem(height, 80);
              div {
                color: #333;
                .px2rem(font-size, 24);
                // .px2rem(margin-left,4);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              span {
                // position: absolute;
                .px2rem(font-size, 22);
                // .px2rem(bottom,10);
                // .px2rem(right,28);
                color: #999;
              }
            }
          }
        }
        .item-comment-part {
          &:last-child {
            border: none;
          }
        }
      }
    }
  }

  .approval-tline-box {
    background-color: #f5f7f9;
    .px2rem(padding-top, 34);
    .px2rem(padding-bottom, 20);
    .approval-tline {
      padding: 0 0 15px 0;
      .time-node {
        position: relative;
        overflow: hidden;
        &:before {
          position: absolute;
          top: 0;
          bottom: 0;
          .px2rem(left, 45);
          width: 1px;
          content: '';
          display: block;
          background: #e0e0e0;
          -webkit-transform: scaleX(0.5);
          transform: scaleX(0.5);
        }
        &:first-child:before {
          position: absolute;
          .px2rem(top, 44);
          bottom: 0;
          .px2rem(left, 45);
          width: 1px;
          content: '';
          display: block;
          background: #e0e0e0;
        }
        &:last-of-type {
          .nodebox {
            margin-bottom: 0;
          }
        }
        &:last-child:after {
          content: '';
          top: 48px;
          bottom: 0;
          position: absolute;
          width: 4px;
          left: 10px;
        }
        .node-status {
          position: absolute;
          display: inline-block;
          border-radius: 50%;
          .px2rem(top, 5);
          .px2rem(left, 27);
          .px2rem(padding-top, 25);
          .px2rem(padding-bottom, 25);
          // height: 36px;
          .px2rem(height, 38);
          .action-icon {
            .px2rem(width, 38);
          }
        }
        .nodebox {
          // margin: 18px 0 0 22px;
          .px2rem(margin-left, 92);
          .px2rem(margin-right, 22);
          .px2rem(margin-bottom, 30);
          .px2rem(padding-top, 24);
          .px2rem(padding-bottom, 18);
          .px2rem(padding-left, 20);
          .px2rem(border-radius, 4);
          position: relative;
          // padding-right: 4px;
          .px2rem(padding-right, 20);
          background: #fff;
          z-index: 99;

          &:before {
            background: #fff;
          }

          &:after {
            left: -4px;
            background: #fff;
          }

          .activity-top {
            display: flex;
            align-items: center;
            .px2rem(font-size, 32);
            color: #333;
            &.border {
              .px2rem(padding-bottom, 22);
              border-bottom: solid 1px #eee;
            }
            .activity-name {
              .px2rem(margin-right, 15);
              color: #999;
              // font-weight: 700;
              .px2rem(font-size, 30);
              .px2rem(max-width, 260);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .activity-status {
            flex: 1;
            .px2rem(margin-top, 10);
            .px2rem(margin-bottom, 5);
            .px2rem(font-size, 26);
            // border-bottom: 1px solid #d9d9d9;
            .activity-status-label {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .px2rem(padding-bottom, 2);
              span {
                .px2rem(font-size, 24);
                .px2rem(max-width, 260);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              span.icon {
                .px2rem(margin-right, 10);
                color: #d9d9d9;
                &.expand {
                  transform: rotate(90deg);
                }
              }
            }
          }
          .activity-todo {
            display: flex;
            flex-wrap: wrap;
            .px2rem(padding-top, 26);
            border-bottom: 1px solid #eee;
          }
          .arrow {
            width: 8px;
            height: 16px;
            position: absolute;
            overflow: hidden;
            top: 8px;
            left: 1px;
            z-index: 1;
          }
          .nodebox-inner {
            padding: 14px 14px 14px 64px;
            margin-left: 8px;
            position: relative;
            border: 0;
            border-radius: 5px;
            background: #fff;
            box-shadow: 0 0 3px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            .box-arrow-l {
              position: absolute;
              top: 50%;
              color: #e0e0e0;
              right: 0;
              margin-top: -10px;
              font-size: 20px;
            }

            .node-avatar {
              top: 14px;
              left: 14px;
              color: #fff;
              width: 44px;
              height: 44px;
              line-height: 44px;
              font-size: 14px;
              border-radius: 50%;
              overflow: hidden;
              cursor: pointer;
              text-align: center;
              display: -webkit-box;
              display: -webkit-flex;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .activity-name {
              font-size: 12px;
              text-overflow: ellipsis;
              display: inline-block;
              max-width: 120px;
              overflow: hidden;
              white-space: nowrap;
              vertical-align: middle;
            }
            .result-line {
              color: #ccc;
              font-size: 14px;
              margin-top: 7px;
              display: inline-block;
              min-height: 16px;
              line-height: 16px;
              overflow: hidden;
              word-break: break-all;
            }
            .operatetime {
              position: absolute;
              right: -5px;
              top: 0;
              color: #b2b2b2;
              font-size: 12px;
              -webkit-transform: scale(0.8);
              transform: scale(0.8);
            }
          }
        }
      }
    }
  }
  .user-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    .px2rem(width, 100);
    .px2rem(margin-left, 18);
    .px2rem(margin-right, 18);
    .px2rem(margin-bottom, 18);
    img,
    div.user-img {
      .px2rem(width, 44);
      .px2rem(height, 44);
      .px2rem(line-height, 44);
      border-radius: 50%;
    }
    div.user-img {
      display: block;
      // .px2rem(font-size, 36);
      color: #fff;
      text-align: center;
    }
    div.user-name {
      .px2rem(width, 100);
      .px2rem(margin-top, 6);
      .px2rem(font-size, 24);
      transform: scale(0.9);
      color: #666;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      // text-overflow: ellipsis;
    }
    div.img-status {
      position: absolute;
      .px2rem(top, 24);
      .px2rem(right, 10);
      .px2rem(width, 24);
      .px2rem(height, 24);
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .row {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    // padding: 5px;
    width: 100%;
  }
  .sheet-comment {
    .node-avatar,
    .node-status,
    .nodebox .ding,
    .user-avatar {
      position: absolute;
    }
    .nodebox .username {
      color: #222;
      font-size: 17px;
    }
    .agree .result-line,
    .forward .result-line,
    .submit .result-line {
      color: #6abd5f;
    }
    .bd-bot {
      width: 100%;
      border: 0 !important;
      // background-image: -webkit-linear-gradient(
      //   0deg,
      //   #e4e4e4,
      //   #e4e4e4 50%,
      //   transparent 50%
      // );
      // background-image: linear-gradient(
      //   0deg,
      //   #e4e4e4,
      //   #e4e4e4 50%,
      //   transparent 50%
      // );
      // background-size: 100% 1px;
      // background-repeat: no-repeat;
      // background-position: bottom;
      .username {
        margin-top: 10px;
        color: #222;
        font-size: 18px;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
      }
      .approve-head {
        position: relative;
        padding: 14px 0;
        margin: 0 10px;
        text-align: left;
        overflow: hidden;
        border-bottom: none;
        .userinfo-container {
          .icon-ding {
            color: #108ee9;
            margin-left: 25px;
          }
        }
        .approve-user-head {
          color: #fff;
          width: 60px;
          height: 60px;
          line-height: 60px;
          text-align: center;
          font-size: 18px;
          border-radius: 50%;
          margin-top: 6px;
          margin-right: 9px;
          overflow: hidden;
          float: left;
          border-radius: 50%;
          cursor: pointer;
          img {
            width: 100%;
          }
        }
        .status {
          margin-top: 10px;
          color: #6abd5f;
          font-size: 15px;
        }
        .comment-expand,
        .comment-collapse {
          position: absolute;
          height: 30px;
          line-height: 30px;
          top: 15px;
          right: 15px;
          .px2rem(font-size, 24);
          width: 80px;
          border: 1px solid #6abd5f;
          border-radius: 2px;
          text-align: center;
          color: #6abd5f;
        }
      }
    }
  }
  .h3-button::before {
    border-bottom: none;
  }
}

@keyframes slide {
  from {
    transform: translate3d(0, 20%, 0);
    opacity: 0;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
</style>
