<template>
    <div id="form-comment">
        <div class="bd-bot status-info">
            <div class="approve-user-head" @click='showUserInfo(originatorAccount)'>
                <img :src="originatorProfileUrl" alt="图片" v-if='originatorProfileUrl' />
                <div style="color:#fff;" v-if="!originatorProfileUrl">{{originatorName.substr(originatorName.length-2,2)}}</div>
            </div>
            <div class="user-info">
                <div class="username" v-if="!this.ResponseContext.IsExternalForm">
                    {{originatorName}}
                </div>
                <div class="username" v-else>
                    外部人员
                </div>
                <div class="status">
                    <span style="color:#FFAD69"  v-if="this.ResponseContext.BizObjectStatus===0">草稿</span>
                    <span style="color:#00ce98"  v-if="this.ResponseContext.BizObjectStatus===1">已完成</span>
                    <span style="color:#37abfd"  v-if="this.ResponseContext.BizObjectStatus===2">进行中</span>
                    <span style="color:#999"  v-if="this.ResponseContext.BizObjectStatus===3">已取消</span>
                </div>
            </div>

            <div class="trigger" v-show="!this.ResponseContext.IsExternalForm">
                <div class="view-graph" @click="showGraph">
                    流程图
                </div>
                <div class="comment-expand" @click='toggleCollapse'>
                    <span v-show="isCollapse">展开日志</span>
                    <span v-show="!isCollapse">收起日志</span>
                </div>
            </div>

            <!-- <div class="trigger" @click="goWorkflowLogsPage()">
              <div v-if="this.ResponseContext.BizObjectStatus===1">全部流程日志</div>
                <div v-if="this.ResponseContext.BizObjectStatus===2">
                  {{this.ResponseContext.WorkItems[this.ResponseContext.WorkItems.length-1].UserName}}
                  <span v-if='this.ResponseContext.WorkItems[this.ResponseContext.WorkItems.length-1].State === 1'>审批</span>
                  <h3-icon class="icon" type="right"></h3-icon>
                </div>
            </div> -->
        </div>

        <!-- <transition enter-active-class="animated fadeIn comment-fade" leave-active-class="animated fadeOut comment-fade"> -->
        <div class="bd-bot" v-show='!isCollapse'>
            <div class="approval-tline-box" >
                <div class="approval-tline ">
                    <div class="time-node" v-for="(activity,_index) of groupWorkItems" :key="activity.key">
                        <div class="node-status">
                            <img class="action-icon" :src="getApproveImg(activity)" >
                        </div>
                        <div class="nodebox">
                            <div class="activity-name">
                                {{activity.name}}
                            </div>
                            <div class="activity-status " :class="[activity.finishedItems.length>0?'bd-bot':'']" :style="{color:statusColor[activity.status]}">
                                <div class="activity-status-label" @click="toggleTodoUsers(activity)">
                                    <span :style="{color:statusColor[activity.status-1]}" v-if="activity.itemType!=3">{{activity.statusText}}</span>
                                    <span :style="{color:statusColor[0]}" v-if="activity.itemType==3 && activity.todoUsers.length>0">{{activity.statusText}}</span>
                                    <span :style="{color:statusColor[1]}" v-if="activity.itemType==3 && activity.todoUsers.length==0">{{activity.statusText}}</span>
                                    <span class="icon icon-next2" :class="[!activity.collapse?'expand':'']" v-show="activity.key!=999"></span>
                                    <!-- <span class="icon icon-arrow-down" v-show="activity.status===1 && !activity.collapse"></span> -->
                                </div>
                                <div class="activity-todo" v-show="!activity.collapse">
                                    <div class="user-wrapper" v-for="(user,index) in activity.todoUsers" :key="index" @click="showUserInfo(user.dingtalkAccount || user.DingTalkAccount)">
                                        <img :src="user.url || user.ProfilePhotoUrl" alt="图片" v-if='user.url || user.ProfilePhotoUrl' />
                                        <div class="user-img dp-font28" :style="{background:Colors[index%5]}" v-if="!user.url && !user.ProfilePhotoUrl">{{user&&getUserDisplayName(user.name)}}</div>
                                        <div class="user-name">{{user.name }}</div>
                                            <div class="img-status" >
                                            <img :src="getWorkingImg()" />
                                        </div>
                                    </div>
                                    <div class="user-wrapper" v-for="(item,index) in activity.finishedItems" :key="'a'+index" @click="showUserInfo(item.dingtalkAccount || item.DingTalkAccount)">
                                        <img :src="item.UserProfilePhotoUrl || item.ProfilePhotoUrl" alt="图片" v-if='item.UserProfilePhotoUrl || item.ProfilePhotoUrl' />
                                        <div class="user-img dp-font28" :style="{background:Colors[index%5]}" v-if="!item.UserProfilePhotoUrl && !item.ProfilePhotoUrl">{{item&&getUserDisplayName(item.UserName)}}</div>
                                        <div class="user-name">{{item.UserName}}</div>
                                            <div class="img-status" >
                                            <img :src="getStatusImage(item)" />
                                        </div>
                                    </div>
                                    <div class="user-wrapper" v-for="(item,index) in activity.cancelItems" :key="'b'+index" @click="showUserInfo(item.dingtalkAccount || item.DingTalkAccount)">
                                        <img :src="item.UserProfilePhotoUrl || item.ProfilePhotoUrl" alt="图片" v-if='item.UserProfilePhotoUrl || item.ProfilePhotoUrl' />
                                        <div class="user-img dp-font28" :style="{background:Colors[index%5]}" v-if="!item.UserProfilePhotoUrl && !item.ProfilePhotoUrl">{{item&&getUserDisplayName(item.UserName)}}</div>
                                        <div class="user-name">{{item.UserName }}</div>
                                            <div class="img-status" >
                                            <img :src="getStatusImage(item)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="activity-nodes">
                              <!-- item.state==6:转交 -->
                                <div class="item-nodes"  v-for="(item,index) in activity.finishedItems" :class="[index!=activity.finishedItems.length-1?'bd-bot':'']" :key="'c'+index" v-if="item.State==2 || item.State==6 || item.State==4">
                                    <div class="item-head">
                                        <div class="item-avator" @click="showUserInfo(item.DingTalkAccount)">
                                            <img :src="item.UserProfilePhotoUrl || item.ProfilePhotoUrl"  v-if='item.UserProfilePhotoUrl || item.ProfilePhotoUrl' />
                                            <div class="user-name" v-if="!item.UserProfilePhotoUrl && !item.ProfilePhotoUrl">{{getUserDisplayName(item.UserName)}}</div>
                                            <div class="img-status" >
                                                <img :src="getStatusImage(item)" />
                                            </div>
                                        </div>
                                        <div class="item-user">
                                            <div class="item-name">
                                                {{item.UserName}}
                                            </div>
                                            <div class="item-wf-status" :style="{color:getWorkItemStatusColor(item)}">
                                                {{getWorkItemStatus(item)}}
                                            </div>
                                        </div>
                                        <div class="item-handletime">
                                            {{getFormatFinishedTime(item.FinishTime)}}
                                        </div>
                                    </div>
                                    <div class="item-comment" v-if="getCommentDisplayStatus(item.Comment)">
                                        <div class="item-comment-text"  v-if="getCommentTextDisplayStatus(item.Comment.Text)">
                                            {{item.Comment.Text}}
                                        </div>
                                        <div class="item-comment-signature" v-if="item.Comment.Signature">
                                          <img :src="item.Comment.Signature" />
                                        </div>

                                        <div class="item-comment-pic" v-if="item.Comment && item.Comment.Images.length>0">
                                             <img :src="img.url" :id="img.code" v-for="(img,index) in item.Comment.Images" :key="index" @click="previewImage(item.Comment.Images,index)"/>
                                        </div>
                                        <div class="item-comment-file" v-if="item.Comment && item.Comment.Files.length>0">
                                            <a href="javascript:;" class="item-file"  @click="previewFile(file)" v-for="file in item.Comment.Files"  :key="file.Code">
                                                <div class="file-icon">
                                                    <!-- <span class="icon-Shape2"></span> -->
                                                    <span :class="showIcon(file)"></span>
                                                </div>
                                                <div class="file-info">
                                                    <div>{{file.Name}}</div>
                                                    <span>{{getFileSize(file.Size)}}</span>
                                                </div>
                                            </a>
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
        <!-- </transition> -->

        <div v-transfer-dom>
        <image-viewer v-if="photos.length>0"
          :show="previewShow"
          :photos="photos"
          :current="current"
            @update:show="updataShow"
          >
        </image-viewer>
      </div>
    </div>
</template>

<script>
import { isDingtalk } from '../../../config/common';
import { getPreviewFileUrl, getInstanceStateInfos } from '../../../service/get-data';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { imgBaseUrl, baseUrl } from '../../../config/env';
import h3Icon from '../../../../packages/components/h3-icon/index.vue';
import { H3Tab, H3TabItem } from '../../../../packages/components/h3-tab/';
import ImageViewer from '../../../../packages/components/h3-imageviewer/index.vue';
import { TransferDom } from 'vux';
import { setLeft } from '../../../config/dingtalk-interface';

export default {
  name: 'FormComment',
  props: ['EnableReviewExternalForm'],
  components: {
    h3Icon,
    H3Tab,
    H3TabItem,
    ImageViewer,
  },
  data() {
    return {
      Colors: ['#4DA9EB', '#00B25E', '#F19333', '#F06065', '#5C7197', '#9D88BF'],
      ColorLength: 6,
      isCollapse: true,
      originatorProfileUrl: '',
      originatorName: '', // 发起人
      originatorAccount: '',
      status: '', // 审批状态
      isIconDing: false,
      approveUserId: '',
      nodeApproveUserId: '',
      MyComment: '',
      statusColor: ['#37abfd', '#00CE98', '#d6d6d6', '#e64340'],
      itemStatusColor: ['#00CE98', '#e64340', '#d9d9d9'],
      groupWorkItems: [],
      childInstances: [], // 子流程
      tokens: [], // token表
      defalutName: '外客',
      docExtension: '.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.txt',
      isFirstExpand: true, // 是否第一次展开，第一次展开请求数据
      previewShow: false,
      current: 0,
      photos: [],
      imgPreviewUrlHandler: `${baseUrl}/Form/DownloadFileByUUID?corpid=${this.$store.state.corpId}&uid=`,
      getUUidUrl: `${baseUrl}/Form/GetDownloadFileUUIDs/?AttachmentIdStr=`,
      setLeftCallback: null,
    };
  },
  directives: {
    TransferDom,
  },
  created() {
    if (window.GlobalConfig.isExternalForm) {
      this.imgPreviewUrlHandler = `${baseUrl}/Form/DownloadFileByUUID?corpid=${this.$store.state.corpId}&engineCode=${window.GlobalConfig.engineCode}&uid=`;
    }
    this.render();
  },
  methods: {
    goWorkflowLogsPage() {
      this.$router.push({
        name: 'workflowLogs',
        params: {
          instanceId: this.ResponseContext && this.ResponseContext.InstanceId,
          workflowCode: this.ResponseContext && this.ResponseContext.SchemaCode,
        },
      });
    },
    async requestInstanceStateInfos(instanceId) {
      const res = await getInstanceStateInfos(instanceId);
      if (res.Successful) {
        this.tokens = res.ReturnData.Tokens;
        this.childInstances = res.ReturnData.Childs;
        if (this.groupWorkItems.length === 0 && this.ResponseContext.WorkItems.length > 0) {
          this.formatedWorkItems();
        }
      }
    },
    // 初始化数据
    render() {
      if (this.ResponseContext.WorkItems && this.ResponseContext.WorkItems.length > 0) {
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
    },
    toggleTodoUsers(activitys) {
      const activity = activitys;
      if (activity.key === 999) {
        return;
      }
      activity.collapse = !activity.collapse;
    },
    formatedWorkItems() {
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
        if ((workitem.State === 2 || (workitem.State === 6)) && workitem.Approval !== -1) {
          tmpGroupObj.finishedItems.push(workitem);
        } else if ((workitem.State === 2 && workitem.Approval === -1) || workitem.State === 3) {
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
    },
    // 子流程处理
    formatChildInstances() {
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
    },
    insertSpecifiedIndexEle(target, ele) {
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
    },
    getItemComment(tempItem) {
      const item = tempItem;
      for (const comment of this.ResponseContext.Comments) {
        if (comment.TokenId === item.TokenId && comment.UserId === item.UserId) {
          item.Comment = comment;
          comment.Images = [];
          // comment.ImageUrls=[];
          comment.Files = [];
          // 区分图片和附件
          if (comment) {
            if (comment.Attachments && comment.Attachments.length > 0) {
              for (const attachment of comment.Attachments) {
                if (attachment.ThumbnailUrl) {
                  comment.Images.push({ code: attachment.Code, url: attachment.ThumbnailUrl });
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
    },
    containsKey(arr, key) {
      for (const tmp of arr) {
        if (tmp.key === key) {
          return true;
        }
      }
      return false;
    },
    getKeyObject(arr, key) {
      for (const tmp of arr) {
        if (tmp.key === key) {
          return tmp;
        }
      }
      return null;
    },
    showUserInfo(dingtalkAccount) {
      if (isDingtalk) {
        if (dingtalkAccount) {
          if (dingtalkAccount.indexOf('.') > -1) {
            H3PluginDeveloper.IShowUserInfo(
              dingtalkAccount.substr(0, dingtalkAccount.indexOf('.')),
              this.$store.state.corpId,
            );
          } else {
            H3PluginDeveloper.IShowUserInfo(dingtalkAccount, this.$store.state.corpId);
          }
        }
      }
    },
    showNodeUserId(item) {
      const account = item.DingTalkAccount.substr(0, item.DingTalkAccount.indexOf('.'));
      if (account) {
        H3PluginDeveloper.IShowUserInfo(account, this.$store.state.corpId);
      }
    },
    getApproveImg(item) {
      if (item.status === 2) {
        return `${imgBaseUrl}/images/finished-empty.png`;
      } else if (item.status === 1) {
        return `${imgBaseUrl}/images/working-empty.png`;
      } else if (item.status === 3) {
        // 取消
        return `${imgBaseUrl}/images/cancel.png`;
      }
      return `${imgBaseUrl}/images/reject-empty.png`;
    },
    getWorkingImg() {
      return `${imgBaseUrl}/images/working.png`;
    },
    getFormatFinishedTime(times) {
      let time = times;
      time = new Date(time.replace(/-/g, '/')).Format('yyyy-MM-dd hh:mm');
      return time;
    },
    getStatusImage(item) {
      console.log(item);
      if (item.State === 3) {
        return `${imgBaseUrl}/images/cancel-full.png`;
      } else if (item.Approval === 1 && !item.Delegant) {
        return `${imgBaseUrl}/images/finished.png`;
      } else if (item.Approval === 0) {
        return `${imgBaseUrl}/images/reject.png`;
      } else if (item.Approval === -1) {
        return `${imgBaseUrl}/images/cancel-full.png`;
      } else if (item.Delegant) {
        return `${imgBaseUrl}/images/transfer.png`;
      } else if (item.State === 4) {
        return `${imgBaseUrl}/images/finished.png`;
      }
      return false;
    },
    timeNodeClass(item) {
      const tokenId = item.TokenId;
      const delegant = item.Delegant;
      const itemType = item.ItemType;
      const approval = item.Approval;
      const state = item.State;
      if (tokenId === 1) {
        return 'submit';
      } else if (delegant) {
        // 如果是转发，则显示已转发给**，请**审批
        return 'agree';
      } else if (itemType === 2) {
        // 如果是审批环节
        if (state === 0 || state === 1) {
          return 'agree';
        } else if (approval === 0) {
          // 已驳回
          return 'agree';
        } else if (approval === -1) {
          return 'agree';
        }
        return 'agree';
      }
      return 'submit';
    },
    getApprovalCom(item) {
      const tokenId = item.TokenId;
      const delegant = item.Delegant;
      const itemType = item.ItemType;
      const approval = item.Approval;
      const state = item.State;
      if (tokenId === 1) {
        return '发起申请';
      } else if (delegant) {
        // 如果是转发，则显示已转发给**，请**审批
        const delegantName = this.GetDelegantName(delegant, this.TodoUsers);
        return `已转发给${delegantName}`;
      } else if (itemType === 2) {
        // 如果是审批环节
        if (state === 0 || state === 1) {
          return '审核中';
        } else if (approval === 0) {
          // 已驳回
          return '已驳回';
        } else if (approval === -1) {
          return '已取消';
        }
        return '已同意';
      } else if (state === 0 || state === 1) {
        return '处理中';
      } else if (itemType === 3) {
        return '已阅';
      }
      return '已提交';
    },
    GetDelegantName(delegant, workitems) {
      const l = workitems.length;
      for (let i = l - 1; i >= 0; i -= 1) {
        if (workitems[i].UserId === delegant) {
          return workitems[i].UserName;
        }
      }
      return null;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      if (!this.isCollapse) {
        if (this.isFirstExpand) {
          this.requestInstanceStateInfos(this.ResponseContext.InstanceId);
        } else if (this.groupWorkItems.length === 0 && this.ResponseContext.WorkItems.length > 0) {
          this.formatedWorkItems();
        }
      }
    },
    getWorkingActivityStatsText(groupObjs) {
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
              groupObj.statusText = `待${workingItems[0].UserName}、${workingItems[1].UserName}处理`;
            } else if (itemType === 2) {
              groupObj.statusText = `待${workingItems[0].UserName}、${workingItems[1].UserName}审批`;
            } else if (itemType === 3) {
              groupObj.statusText = `待${workingItems[0].UserName}、${workingItems[1].UserName}查阅`;
            }
          } else if (itemType === 0) {
            groupObj.statusText = `待${workingItems[0].UserName}、${workingItems[1].UserName}等${workingItems.length}人处理`;
          } else if (itemType === 2) {
            groupObj.statusText = `待${workingItems[0].UserName}、${workingItems[1].UserName}等${workingItems.length}人审批`;
          } else if (itemType === 3) {
            groupObj.statusText = `待${workingItems[0].UserName}、${workingItems[1].UserName}等${workingItems.length}人查阅`;
          }
        }
      }
    },
    // 获取节点的状态，0,1 进行中，2 通过 3 已取消(全部approval为-1) 4 驳回
    getActivityStatus(groupObjs) {
      const groupObj = groupObjs;
      const workitems = groupObj.value;
      groupObj.name = workitems.length > 0 ? workitems[0].ActivityDisplayName || workitems[0].DisplayName : '';
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
            // 進行中，判斷是否workitem中還存在state=0 ||1的記錄
            // if(this.hasUnfinishedItems(workitems)){
            //     groupObj.status=1;
            //     this.getWorkingActivityStatsText(groupObj);
            // }else{
            //     groupObj.status=3;
            //     groupObj.statusText='已取消';
            // }
          } else if (curToken.State === 2) {
            groupObj.status = 3;
            groupObj.statusText = '已取消';
          } else {
            groupObj.status = 2;
            if (itemType === 0) {
              groupObj.statusText = '已提交';
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
    },
    hasUnfinishedItems(workitems) {
      for (const item of workitems) {
        if (item.State === 1 || item.State === 1) {
          return true;
        }
      }
      return false;
    },
    getCommentDisplayStatus(comment) {
      if (!comment) {
        return false;
      }
      if ((comment.Images && comment.Images.length > 0) ||
      (comment.Files && comment.Files.length > 0)) {
        return true;
      }
      return this.getCommentTextDisplayStatus(comment.Text, comment.Signature);
    },
    getCommentTextDisplayStatus(text, signature) {
      const txt = text.replace(/(^\s*)|(\s*$)/g, '');
      if (txt || signature) {
        return true;
      }
      return false;
    },
    getWorkItemStatusColor(item) {
      if (item.Approval === 0) {
        return this.itemStatusColor[1];
      } else if (item.Approval === -1) {
        return this.itemStatusColor[2];
      }
      return this.itemStatusColor[0];
    },
    getWorkItemStatus(item) {
      if (item.Delegant) {
        for (const workitem of this.ResponseContext.WorkItems) {
          if (item.Delegant === workitem.UserId) {
            return `已转交给${workitem.UserName}`;
          }
        }
        return '已转发';
      }
      if (item.ItemType === 0) {
        return '已提交';
      } else if (item.ItemType === 2) {
        if (item.Approval === 1) {
          return '已审批';
        } else if (item.Approval === 0) {
          return '已驳回';
        }
        return '已取消';
      } else if (item.ItemType === 9) {
        return '已结束';
      }
      return '已阅';
    },
    getUserDisplayName(name) {
      if (name) {
        return name.substr(name.length - 2, 2);
      }
      return '外客';
    },
    getFileSize(size) {
      const number = size / (1024 * 1024);
      if (number < 1) {
        // 小于1M已kb显示
        return `${(size / 1024).toFixed(1)}Kb`;
      }
      return `${number.toFixed(1)}Mb`;
    },
    showIcon(file) {
      let suffix = '';
      const tmp = file.Name.split('.');
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
    Validate() {
      return true;
    },
    GetValue() {
      return this.value;
    },
    // 返回数据值
    SaveDataField() {
      let result = {};
      result = this.value;
      if (!result) {
        return {};
      }
      let IsNewComment = false;
      if (this.MyComment === undefined) {
        if (!this.GetValue()) return {};
        this.MyComment = {
          CommentID: H3PluginDeveloper.IGuid(),
          UserName: '我的意见',
          DateStr: new Date().toString(),
          Text: this.GetValue(),
          //  Avatar: "~/Content/Images/avator.jpg"
        };
        IsNewComment = true;
        this.AddCommentItem(this.MyComment);
      } else if (this.MyComment.Text === this.GetValue()) {
        return {};
      } else {
        this.GetValue();
      }

      // 添加校验，如果值没变，就不会需要提交
      result = {
        CommentID: this.MyComment.CommentID,
        Text: this.GetValue(),
        IsNewComment,
        SetFrequent: this.ResponseContext.IsMobile ? false : $(this.SaveFrequentCk).is(':checked'),
      };
      return result;
    },

    showGraph() {
      if (this.ResponseContext.WorkItems) {
        this.$router.push({
          name: 'graph',
          params: {
            workflowCode: this.ResponseContext.SchemaCode,
            instanceId: this.ResponseContext.InstanceId,
          },
        });
      }
    },
    previewFile(file) {
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
    },
    async requestPreviewFileUrl(fileId) {
      H3PluginDeveloper.IShowPreLoader('正在生成预览文件...');
      const res = await getPreviewFileUrl(fileId);
      if (res) {
        H3PluginDeveloper.IHidePreLoader();
        const htmlUrl = res.htmlUrl;
        if (htmlUrl) {
          dd.biz.util.openLink({
            url: htmlUrl,
            onSuccess() {
              H3PluginDeveloper.IHidePreLoader();
            },
            onFail() {
              H3PluginDeveloper.IHidePreLoader();
            },
          });
        }
      } else {
        H3PluginDeveloper.IHidePreLoader();
      }
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
      photos.forEach((file) => {
        const item = {};
        this.getUUid(file, item);
        self.photos.push(item);
      });
      this.current = index;
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
  },
  computed: {
    value() {
      return this.$store.state.formData.responseContext.Comments;
    },

    TodoUsers() {
      return this.$store.state.formData.responseContext.WorkItems;
    },
    ResponseContext() {
      return this.$store.state.formData.responseContext;
    },
  },
};
</script>

<style lang='less'>
@import '../../../styles/mixins.less';

#form-comment {
  .comment-fade {
    animation-duration: 0.2s !important;
    animation-timing-function: linear !important;
  }
  background: #fff;
  .px2rem(padding-left,24);

  div.status-info {
    // display: flex;
    // justify-content: space-between;
    .px2rem(padding-top,20);
    .px2rem(padding-bottom,14);
    overflow: hidden;
    .approve-user-head {
      float: left;
      .px2rem(flex-basis,114);
      img,
      div {
        .px2rem(width,114);
        .px2rem(height,114);
        border-radius: 50%;
      }
      div {
        text-align: center;
        .px2rem(line-height,114);
        background: #108ee9;
      }
    }
    .user-info {
      float: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .px2rem(width,150);
      // .px2rem(height,114);
      .px2rem(margin-left,26);
      div.username {
        .px2rem(font-size,32);
        color: #333;
      }
      div.status {
        .px2rem(width,80);
        .px2rem(height,32);
        .px2rem(line-height,32);
        letter-spacing: 0.67px;
        font-family: PingFang-SC-Regular;
        background: rgba(24,144,255,0.10);
        border: 1px solid #1890FF;
        .px2rem(border-radius,80);
        margin-top: 4px;
        text-align: center;
        span{
          .px2rem(font-size,20);
          color: #1890FF;
        }

      }
    }
    .trigger {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .px2rem(margin-right,39);
      .px2rem(height,114);
      .px2rem(width,280);
      .px2rem(font-size,30);
      color: #108ee9;
    }
  }

  div.activity-nodes {
    overflow: hidden;
    // .px2rem(margin-top,26);
    div.item-nodes {
      .px2rem(padding-top,34);
      .px2rem(padding-bottom,34);
      .item-head {
        overflow: hidden;
        .item-avator {
          float: left;
          position: relative;
          .px2rem(width,84);
          .px2rem(height,84);
          div.user-name,
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          div.user-name {
            text-align: center;
            .px2rem(line-height,84);
            color: #fff;
            background: #108ee9;
            overflow: hidden;
            white-space: nowrap;
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
          float: left;
          display: flex;
          .px2rem(margin-left,17);
          .px2rem(height,84);
          flex-direction: column;
          justify-content: space-between;
          .item-name {
            color: #666;
            .px2rem(font-size,32);
          }
          .item-wf-status {
            .px2rem(font-size,24);
          }
        }
        .item-handletime {
          float: right;
          // .px2rem(margin-right,25);
          color: #b2b2b2;
          .px2rem(font-size,22);
          margin-top: 3px;
        }
      }
      .item-comment {
        overflow: hidden;
        .px2rem(margin-left,100);
        .px2rem(margin-top,16);
        .px2rem(padding,16);
        border-radius: 2px;
        background: #f8f8f8;
        border: 1px dashed #cfcfcf;
        .item-comment-text {
          color: #666;
          .px2rem(font-size,26);
          word-break: break-word;
          // .px2rem(margin-bottom,8);
        }
        .item-comment-signature{
          text-align: right;
          .px2rem(padding,12);
          img {
            // .px2rem(height, 68);
            .px2rem(max-height, 44);
            .px2rem(max-width, 240);
            vertical-align: middle;
          }
        }
        .item-comment-pic {
          overflow: hidden;
          img {
            .px2rem(width,128);
            .px2rem(height,128);
            .px2rem(margin-right,11);
            .px2rem(margin-bottom,11);
            float: left;
          }
        }
        .item-comment-file {
          .px2rem(margin-top,25);
          .item-file {
            width: 100%;
            .px2rem(padding,2);
            .px2rem(margin-bottom,5);
            background: #fff;
            border: 1px solid #f2f3f5;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            position: relative;
            &:active {
              background: #f8f8f8;
            }
            .file-icon {
              flex-shrink: 0;
              text-align: center;
              .px2rem(flex-basis,80);
              .px2rem(height,80);
              .px2rem(line-height,80);
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              // background: #f54335;
              border-radius: 2px;
              span {
                .px2rem(font-size,60);
              }
            }
            .file-info {
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: center;
              .px2rem(height,80);
              div {
                color: #000;
                .px2rem(font-size,28);
                // .px2rem(margin-left,4);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              span {
                // position: absolute;
                .px2rem(font-size,22);
                // .px2rem(bottom,10);
                // .px2rem(right,28);
                color: #999;
              }
            }
          }
        }
      }
    }
  }

  .approval-tline-box {
    background-color: #fff;
    .approval-tline {
      padding: 0 0 15px 0;
      .time-node {
        position: relative;
        overflow: hidden;
        &:before {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 10px;
          width: 1px;
          content: '';
          display: block;
          background: #e0e0e0;
          -webkit-transform: scaleX(0.5);
          transform: scaleX(0.5);
        }
        &:first-child:before {
          position: absolute;
          top: 44px;
          bottom: 0;
          left: 10px;
          width: 1px;
          content: '';
          display: block;
          background: #e0e0e0;
        }
        &:last-child:after {
          content: '';
          top: 48px;
          bottom: 0;
          position: absolute;
          width: 4px;
          background-color: #fff;
          left: 10px;
        }
        .node-status {
          position: absolute;
          display: inline-block;
          border-radius: 50%;
          background-color: #fff;
          top: 12px;
          left: 2px;
          padding: 8px 0;
          // height: 36px;
          .px2rem(height, 34);
          .action-icon {
            .px2rem(width, 34);
          }
        }
        .nodebox {
          // margin: 18px 0 0 22px;
          .px2rem(margin-left,80);
          .px2rem(margin-right,90);
          .px2rem(margin-top,18);
          .px2rem(margin-bottom,18);
          .px2rem(padding-top,18);
          .px2rem(padding-left,20);
          .px2rem(border-radius,10);
          position: relative;
          // padding-right: 4px;
          .px2rem(padding-right,20);
          padding-bottom: 4px;
          box-shadow: 0 0 5px #d9d9d9;
          z-index: 99;
          &::before,
          &::after {
            position: absolute;
            content: '';
            width: 10px;
            height: 10px;
            left: -5px;
            top: 20px;
            margin-top: -6px;
            overflow: hidden;
            pointer-events: none;
            -webkit-transform: rotate(45deg);
            -mz-transform: rotate(45deg);
            transform: rotate(45deg);
            z-index: 98;
          }

          &:before {
            background: #fff;
            box-shadow: -1px 1px 3px #d9d9d9;
          }

          &:after {
            left: -4px;
            background: #fff;
          }

          .activity-name {
            .px2rem(font-size,32);
            color: #333;
          }
          .activity-status {
            .px2rem(margin-top,10);
            .px2rem(margin-bottom,5);
            .px2rem(font-size,26);
            // border-bottom: 1px solid #d9d9d9;
            .activity-status-label {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .px2rem(padding-bottom,5);
              span {
                .px2rem(font-size,26);
              }
              span.icon {
                color: #d9d9d9;
                &.expand {
                  transform: rotate(90deg);
                }
              }
            }
            .activity-todo {
              overflow: hidden;
              .px2rem(margin-top,36);
              div.user-wrapper {
                float: left;
                position: relative;
                .px2rem(height,128);
                .px2rem(width,82);
                .px2rem(margin-right,20);
                .px2rem(margin-bottom,14);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                img,
                div.user-img {
                  .px2rem(width,84);
                  .px2rem(height,84);
                  .px2rem(line-height,84);
                  border-radius: 50%;
                }
                div.user-img {
                  display: block;
                  // .px2rem(font-size, 36);
                  color: #fff;
                  text-align: center;
                }
                div.user-name {
                  width: 100%;
                  .px2rem(font-size, 24);
                  color: #999;
                  text-align: center;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                div.img-status {
                  position: absolute;
                  .px2rem(top,50);
                  right: 0;
                  .px2rem(width,34);
                  .px2rem(height,34);
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
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
}

#form-comment {
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
      background-image: -webkit-linear-gradient(0deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
      background-image: linear-gradient(0deg, #e4e4e4, #e4e4e4 50%, transparent 50%);
      background-size: 100% 1px;
      background-repeat: no-repeat;
      background-position: bottom;
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
          .px2rem(font-size,24);
          width: 80px;
          border: 1px solid #6abd5f;
          border-radius: 2px;
          text-align: center;
          color: #6abd5f;
        }
      }
    }
  }
  .h3-button::before{
    border-bottom: none;
  }
}
</style>

