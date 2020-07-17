<template>
  <div id="workflow-state">
    <div class="bd-bot status-info">
      <div class="approve-user-head" @click="showUserInfo(originatorAccount)">
        <img v-if="originatorProfileUrl"          :src="originatorProfileUrl" alt="图片" />
        <div v-if="!originatorProfileUrl" style="color:#fff;">
          {{ originatorName.substr(originatorName.length - 2,2) }}
        </div>
      </div>

      <div class="user-info">
        <div v-if="!ResponseContext.IsExternalForm" class="username">
          {{ originatorName }}
        </div>
        <div v-else class="username">
          外部人员
        </div>

        <div
          class="status"
          :style="{background: badgeBgColor[ResponseContext.BizObjectStatus]}"
        >
          <span v-if="ResponseContext.BizObjectStatus === 0" style="color:#FFAD69">草稿</span>
          <span v-if="ResponseContext.BizObjectStatus === 1" style="color:#00ce98">已结束</span>
          <span v-if="ResponseContext.BizObjectStatus === 2" style="color:#37abfd">进行中</span>
          <span v-if="ResponseContext.BizObjectStatus === 3" style="color:#999">已取消</span>
        </div>
      </div>

      <div v-show="!ResponseContext.IsExternalForm" class="trigger">
        <div class="view-graph" @click="showWorkDetail">
          流程日志
        </div>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

import { isDingtalk } from '../../../config/common';
import { getPreviewFileUrl, getInstanceStateInfos } from '../../../service/get-data';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';

@Component
export default class FormComment extends Vue {
  @Prop()
  EnableReviewExternalForm!: boolean;

  @Prop()
  bizObjectId!: string;

  @Prop()
  title!: string;

  badgeBgColor: string[] = ['#fceecf', '#D2F5ED', '#cfebfc', '#EBECEF'];

  originatorProfileUrl: string = '';

  originatorName: string = ''; // 发起;

  originatorAccount: string = '';

  groupWorkItems: any = [];

  childInstances: any = []; // 子流;

  tokens: any = []; // token;

  @Watch('bizObjectId', { immediate: true })
  bizObjectIdChanged () {
    this.renderState();
    this.groupWorkItems = [];
  }

  async requestInstanceStateInfos (instanceId) {
    const res = await getInstanceStateInfos(instanceId);
    if (res.Successful) {
      this.tokens = res.ReturnData.Tokens;
      this.childInstances = res.ReturnData.Childs;
      if (
        this.groupWorkItems.length === 0 &&
        this.ResponseContext.WorkItems.length > 0
      ) {
        this.formatedWorkItems();
      }
    }
  }

  // 初始化数据
  renderState () {
    if (
      this.ResponseContext.WorkItems &&
      this.ResponseContext.WorkItems.length > 0
    ) {
      const originatorWorkItem = this.ResponseContext.WorkItems[0];
      const dingTalkAccount = originatorWorkItem.DingTalkAccount;
      const userName = originatorWorkItem.UserName;
      const avator = originatorWorkItem.UserProfilePhotoUrl;
      // 先统一显示名字 todo
      if (avator) {
        this.originatorProfileUrl = avator;
      }
      this.originatorName = userName || '外部人员';
      this.originatorAccount = dingTalkAccount;
    }
  }

  formatedWorkItems () {
    // 按照tokenid分组
    for (const workitem of this.ResponseContext.WorkItems) {
      const tokenId = workitem.TokenId;
      let tmpGroupObj = this.getKeyObject(this.groupWorkItems, tokenId);
      if (!tmpGroupObj) {
        tmpGroupObj = {
          key: tokenId,
          value: [],
          status: -1,
          itemType: '-1',
          statusText: '',
          name: '',
          todoUsers: [],
          collapse: true,
          finishedItems: [],
          cancelItems: [],
        };
        this.groupWorkItems.push(tmpGroupObj);
      }
      if (
        ((workitem.State === 2 || workitem.State === 6) && workitem.Approval !== -1) ||
        (workitem.State === 3 && (workitem.FinisherName))
      ) {
        tmpGroupObj.finishedItems.push(workitem);
      } else if (
        (workitem.State === 3 && (!workitem.FinisherName))
      ) {
        tmpGroupObj.cancelItems.push(workitem);
      }
      this.getItemComment(workitem);
      tmpGroupObj.value.push(workitem);
    }
    this.formatChildInstances();
    if (this.groupWorkItems.length > 0) {
      for (const group of this.groupWorkItems) {
        this.getActivityStatus(group);
      }
    }
    // 如果流程已经结束，添加一个结束节点
    if (this.ResponseContext.WorkflowState === 4) {
      const tmpGroupObj = {
        key: 999,
        value: [],
        status: 2,
        statusText: '已结束',
        name: '结束',
        todoUsers: [],
        collapse: true,
        finishedItems: [],
      };
      this.groupWorkItems.push(tmpGroupObj);
    }

    this.groupWorkItems.sort((a, b) => {
      return a.key - b.key;
    });

    this.groupWorkItems.forEach(node => {
      if (Array.isArray(node.finishedItems) && node.finishedItems.length > 1) {
        node.finishedItems.sort((a, b) => Date.parse(b.FinishTime) - Date.parse(a.FinishTime));
      }
    });
  }

  // 子流程处理
  formatChildInstances () {
    if (this.childInstances && this.childInstances.length > 0) {
      for (const instance of this.childInstances) {
        const tokenId = instance.TokenId;
        let tmpGroupObj = this.getKeyObject(this.groupWorkItems, tokenId);
        if (!tmpGroupObj) {
          tmpGroupObj = {
            key: tokenId,
            value: [],
            status: -1,
            itemType: 9,
            statusText: '',
            name: '',
            todoUsers: [],
            collapse: true,
            finishedItems: [],
            cancelItems: [],
          };
          // 判断顺序
          this.insertSpecifiedIndexEle(this.groupWorkItems, tmpGroupObj);
        }
        instance.ItemType = 9;
        instance.name = instance.UserName;
        if (instance.State === 4) {
          tmpGroupObj.finishedItems.push(instance);
        } else if (instance.State === 5) {
          tmpGroupObj.cancelItems.push(instance);
        } else {
          tmpGroupObj.todoUsers.push(instance);
        }
        tmpGroupObj.value.push(instance);
      }
    }
  }

  insertSpecifiedIndexEle (target, ele) {
    for (let i = target.length - 1; i >= 1; i -= 1) {
      if (target[i].key > ele.key && target[i - 1].key < ele.key) {
        target.splice(i, 0, ele);
        return;
      }
      target.push(ele);
      return;
    }
    if (target && target.length === 1) {
      target.push(ele);
    }
  }

  getItemComment (tempItem) {
    const item = tempItem;
    for (const comment of this.ResponseContext.Comments) {
      if (comment.TokenId === item.TokenId && comment.WorkItemId === item.WorkItemId) {
        item.Comment = comment;
        comment.Images = [];
        // comment.ImageUrls=[];
        comment.Files = [];
        // 区分图片和附件
        if (comment) {
          if (comment.Attachments && comment.Attachments.length > 0) {
            for (const attachment of comment.Attachments) {
              if (attachment.ThumbnailUrl) {
                comment.Images.push({
                  code: attachment.Code,
                  url: attachment.ThumbnailUrl,
                });
                // comment.ImageUrls.push(attachment.ThumbnailUrl);
              } else {
                comment.Files.push(attachment);
              }
            }
          }
        }
        return;
      }
    }
  }

  containsKey (arr, key) {
    for (const tmp of arr) {
      if (tmp.key === key) {
        return true;
      }
    }
    return false;
  }

  getKeyObject (arr, key) {
    for (const tmp of arr) {
      if (tmp.key === key) {
        return tmp;
      }
    }
    return null;
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

  getWorkingActivityStatsText (groupObjs) {
    const groupObj = groupObjs;
    if (groupObj.itemType === 9) {
      if (groupObj.todoUsers.length > 0) {
        groupObj.statusText = '子流程进行中';
      } else {
        groupObj.statusText = '子流程已结束';
      }
    } else {
      const workitems = groupObj.value;
      const itemType = workitems[0].ItemType;
      const workingItems = [];
      const todoUsers = [];
      // let finishedItems=[];
      for (const workitem of workitems) {
        if (workitem.State === 0 || workitem.State === 1) {
          workingItems.push(workitem);
          todoUsers.push({
            id: workitem.UserId,
            name: workitem.UserName,
            url: workitem.UserProfilePhotoUrl,
            dingtalkAccount: workitem.DingTalkAccount,
          });
        }
      }
      groupObj.todoUsers = todoUsers;
      // groupObj.finishedItems=finishedItems;
      if (workingItems.length > 0) {
        if (itemType !== 3) {
          groupObj.status = 1;
        }
        if (workingItems.length === 1) {
          if (itemType === 0) {
            groupObj.statusText = `待${workingItems[0].UserName}处理`;
          } else if (itemType === 2) {
            groupObj.statusText = `待${workingItems[0].UserName}审批`;
          } else if (itemType === 3) {
            groupObj.statusText = `待${workingItems[0].UserName}查阅`;
          }
        } else if (workingItems.length === 2) {
          if (itemType === 0) {
            groupObj.statusText = `待${workingItems[0].UserName}、${
              workingItems[1].UserName
            }处理`;
          } else if (itemType === 2) {
            groupObj.statusText = `待${workingItems[0].UserName}、${
              workingItems[1].UserName
            }审批`;
          } else if (itemType === 3) {
            groupObj.statusText = `待${workingItems[0].UserName}、${
              workingItems[1].UserName
            }查阅`;
          }
        } else if (itemType === 0) {
          groupObj.statusText = `待${workingItems[0].UserName}、${
            workingItems[1].UserName
          }等${workingItems.length}人处理`;
        } else if (itemType === 2) {
          groupObj.statusText = `待${workingItems[0].UserName}、${
            workingItems[1].UserName
          }等${workingItems.length}人审批`;
        } else if (itemType === 3) {
          groupObj.statusText = `待${workingItems[0].UserName}、${
            workingItems[1].UserName
          }等${workingItems.length}人查阅`;
        }
      }
    }
  }

  // 获取节点的状态，0,1 进行中，2 通过 3 已取消(全部approval为-1) 4 驳回
  getActivityStatus (groupObjs) {
    const groupObj = groupObjs;
    const workitems = groupObj.value;
    groupObj.name =
      workitems.length > 0
        ? workitems[0].ActivityDisplayName || workitems[0].DisplayName
        : '';
    const itemType = workitems.length > 0 ? workitems[0].ItemType : null;
    groupObj.itemType = itemType;
    // 把子流程区分开
    if (itemType === 9) {
      if (groupObj.todoUsers.length > 0) {
        groupObj.status = 1;
        this.getWorkingActivityStatsText(groupObj);
      } else {
        groupObj.status = 2;
        // 全部取消的子流程是否存在
        groupObj.statusText = '子流程已结束';
      }
    } else {
      let curToken = null;
      if (this.tokens) {
        for (const token of this.tokens) {
          if (token.TokenId === groupObj.key) {
            curToken = token;
            break;
          }
        }
      }
      if (curToken) {
        if (curToken.State === 0) {
          groupObj.status = 1;
          this.getWorkingActivityStatsText(groupObj);
        } else if (curToken.State === 2) {
          groupObj.status = 3;
          groupObj.statusText = '已取消';
        } else if (curToken.State === 3) {
          groupObj.status = 5;
          groupObj.statusText = '已撤回';
        } else {
          groupObj.status = 2;
          if (itemType === 0) {
            groupObj.statusText = '提交';
          } else if (itemType === 2) {
            if (curToken.Approval === 0) {
              groupObj.status = 4;
              groupObj.statusText = '已驳回';
            } else {
              groupObj.statusText = '已审批';
            }
          } else if (itemType === 3) {
            groupObj.statusText = '已阅';
            this.getWorkingActivityStatsText(groupObj);
          }
        }
      }
    }
  }

  async showWorkDetail () {
    await this.requestInstanceStateInfos(this.ResponseContext.InstanceId);
    if (this.ResponseContext.WorkItems) {
      this.$router.push({
        name: 'workDetail',
        params: {
          workflowCode: this.ResponseContext.SchemaCode,
          instanceId: this.ResponseContext.InstanceId,
          groupWorkItems: JSON.parse(JSON.stringify(this.groupWorkItems)).reverse(),
          title: this.title,
          IsLight: this.ResponseContext.IsLight,
        },
      });
    }
  }

  async requestPreviewFileUrl (fileId) {
    H3PluginDeveloper.IShowPreLoader('正在生成预览文件...');
    const res = await getPreviewFileUrl(fileId);
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

  get ResponseContext () {
    return this.$store.state.Form.ViewModel[this.bizObjectId].$responseContext;
  }
}
</script>

<style lang='less'>
@import '../../../styles/mixins.less';

#workflow-state {
  .comment-fade {
    animation-duration: 0.2s !important;
    animation-timing-function: linear !important;
  }
  position: relative;
  background: #fff;
  .px2rem(padding-left, 24);

  div.status-info {
    // display: flex;
    // justify-content: space-between;
    display: flex;
    align-items: center;
    .px2rem(padding-top, 20);
    .px2rem(padding-bottom, 14);
    // overflow: hidden;
    .approve-user-head {
      .px2rem(flex-basis, 114);
      img,
      div {
        .px2rem(width, 114);
        .px2rem(height, 114);
        border-radius: 50%;
      }
      div {
        text-align: center;
        .px2rem(line-height, 114);
        background: #108ee9;
      }
    }
    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .px2rem(width, 180);
      // .px2rem(height,114);
      .px2rem(margin-left, 40);
      div.username {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .px2rem(font-size, 32);
        color: #333;
      }
      div.status {
        display: flex;
        justify-content: center;
        align-items: center;
        .px2rem(width, 80);
        .px2rem(height, 40);
        .px2rem(line-height, 32);
        font-family: PingFang-SC-Regular;
        background: #cfe5fc;
        .px2rem(border-radius, 80);
        .px2rem(margin-top, 8);
        text-align: center;
        span {
          .px2rem(font-size, 20);
          color: #1890ff;
          transform: scale(0.86);
        }
      }
    }
    .trigger {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .px2rem(margin-right, 39);
      .px2rem(margin-left, 30);
      .px2rem(height, 114);
      .px2rem(width, 280);
      .px2rem(font-size, 30);
      color: #108ee9;
    }
  }
}
</style>
