<template>
    <layout
    :title="title"
    :left-options="{preventGoBack:true}"
    @on-click-back="goBack"
    >
      <div class="user-deparment-choose-page">
          <user-department-choose :routeParams='routeParams' :entry-type="entryType" ></user-department-choose>
      </div>
      <transition :duration='300' enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <div class="forward-comment-wrap" v-if="isOk">
              <div class="forward-comment">
                  <h2 class="dp-font32">转交给：</h2>
                  <div class="forward-user">
                      <span class="icon icon-color">
                          <img :src="selectedItem[0].Avatar||selectedItem[0].ProfilePhotoUrl" v-if='selectedItem[0].Avatar||selectedItem[0].ProfilePhotoUrl'>
                          <span class="user-name dp-font28" v-text='setUserName(selectedItem[0])' v-else></span>
                      </span>
                      <p class="user-font dp-font32">{{selectedItem[0].Name||selectedItem[0].DisplayName}}</p>
                  </div>
                  <div class="comment-input">
                      <textarea class="forward-textarea dp-font32" placeholder="您可以输入转交意见" rows="1" v-model="comments" @input="getInputVal"></textarea>
                  </div>
                  <div class="forward-btn bd-top">
                      <a class="dp-font36 cancel-btn" @click="cancel">取消</a>
                      <a class="dp-font36 confirm-btn" @click='confirmForward'>确定</a>
                  </div>
              </div>
          </div>
      </transition>
    </layout>
</template>
<script>
import { UserSelectEntryType } from '../../config/common';
import userDepartmentChoose from '../organization/user-department-choose-node.vue';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { closeApp } from '../../config/dingtalk-interface';
import preventBodyScrollMixin from '../../mixins/prevent-body-scroll';
import { ViewModelAction } from '@/store/modules/form/viewModel/types';
import * as FormLogic from '@/lib/form-logic/index';


export default {
  name: 'forwardselect',
  components: {
    userDepartmentChoose,
  },
  data() {
    return {
      isOk: false,
      comments: null,
      title: '选择人员',
      routeParams: {
        showUnActive: false,
        userVisible: true,
        orgUnitVisible: false,
        isMultiple: 'false',
      },
      entryType: UserSelectEntryType.Forward,
      selectedItem: [],
    };
  },
  mixins: [preventBodyScrollMixin],
  created() {
    const that = this;
    this.actionControl = this.$route.params.actionControl;
    this.bizObjectId = this.$route.params.bizObjectId;
    this.$root.eventHub.$on('assignVal', (val) => {
      that.selectedItem = val;
      that.isOk = true;
      that.addModalClassName();
      $(document).bind('touchmove', that.forbiddenScroll);
    });
  },
  activated() {
    const self = this;
    // setTitle(this.title);
    // window.backFn = function c() {
    //   self.goBack();
    // };
    // setLeft(window.backFn);
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },
  methods: {
    forbiddenScroll(ev) {
      if (ev.target.tagName === 'TEXTAREA') {
        return true;
      }
      ev.preventDefault();
      return false;
    },
    confirmForward() {
      const userIds = this.selectedItem[0].UnitID || this.selectedItem[0].ObjectId;
      this.dispatchDoAction(this.actionControl, this.comments, userIds);
    },
    // 分发提交
    dispatchDoAction(item, inputCommnets, attachments) {
      const self = this;
      const namespace = 'Form/ViewModel/';
      const actionResult = this.$store.dispatch(namespace + ViewModelAction.DOACTION, {
        bizObjectId: this.bizObjectId,
        actionControl: item,
        inputCommnets,
        attachments, // 这里代表要转交给的人
      });
      actionResult.then((response) => {
        if (response && response.Successful) {
          H3PluginDeveloper.IHidePreLoader();
          // resultHandler(item, response.ReturnData.StartFormResponse, self, self.bizObjectId);
          H3PluginDeveloper.IShowSuccess('提示', '转交成功', () => {
          // 提醒列表界面更新
            FormLogic.destroy({
              store: this.$store,
              bizObjectId: this.bizObjectId
            })
            if (window.GlobalConfig.schemaCode) {
              closeApp();
            } else {
              self.$root.eventHub.$emit('forward-updated');
              self.$router.go(-2);
              self.$store.state.excludeComp = ['formPage'];
              $(document).unbind('touchmove', this.forbiddenScroll);
            }
          });
        }
      }).catch((data) => {
        if (data.Errors) {
          for (let i = 0; i < data.Errors.length; i += 1) {
            H3PluginDeveloper.IShowWarn('提示', data.Errors[i], () => {
              self.isOk = false;
              self.comments = '';
              return false;
            });
          }
        }
      });
    },
    cancel() {
      this.isOk = false;
      this.removeModalClassName();
      this.comments = '';
      $(this.$el)
        .find('.forward-textarea')
        .remove('textarea-scroll');
      $(document).unbind('touchmove', this.forbiddenScroll);
    },
    goBack() {
      this.$router.go(-1);
    },
    // 展示人名的方法
    setUserName(item) {
      let userName = item.Name || item.DisplayName;
      userName = userName && userName.substr(0, 1);
      return userName;
    },
    // 转发弹窗里面的输入框自动换行方法
    getInputVal() {
      this.$nextTick(() => {
        $('textarea')
          .each(function a() {
            this.setAttribute('style', `height:${this.scrollHeight}px;overflow-y:scroll;`);
          })
          .on('input', function b() {
            this.style.height = 'auto';
            this.style.height = `${this.scrollHeight}px`;
          });
      });
      $(this.$el)
        .find('.forward-textarea')
        .addClass('textarea-scroll');
    },
  },
};
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.forward-comment-wrap {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9;
  .forward-comment {
    .px2rem(width,570);
    .px2rem(min-height,343);
    background-color: #fefefe;
    margin-left: 50%;
    transform: translateX(-50%);
    .px2rem(margin-top,308);
    position: relative;
    .px2rem(border-radius,9);
    h2 {
      // padding: .24rem .24rem 0;
      .px2rem(padding-top,24);
      .px2rem(padding-right,24);
      .px2rem(padding-left,24);
      color: #333333;
      font-weight: bold;
    }
    .forward-user {
      // padding: .14rem .24rem .15rem;
      .px2rem(padding-top,14);
      .px2rem(padding-right,24);
      .px2rem(padding-left,24);
      .px2rem(padding-bottom,15);
      display: flex;
      align-items: center;
      .icon-color {
        // width: .56rem;
        .px2rem(width,56);
        .px2rem(height,56);
        display: inline-block;
        overflow: hidden;
        border-radius: 50%;
        background-color: #956fea;
        text-align: center;
        .px2rem(line-height,56);
        img {
          width: 100%;
          height: 100%;
        }
      }
      p {
        display: inline-block;
        color: #333333;
        .px2rem(margin-left,16);
      }
      .user-name {
        color: white;
      }
    }
    .comment-input {
      .px2rem(margin-left,20);
      .px2rem(margin-right,20);
      .px2rem(min-height,10);
      // border: 1px solid #d9d9d9;
      // .px2rem(border-radius,8);
      .px2rem(padding,8);
      font-size: 0;
      position: relative;
      &::before {
        z-index: -1;
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 198%;
        height: 197%;
        transform-origin: 0 0;
        transform: scale(0.5, 0.5);
        border: 1px solid #e4e4e4;
        .px2rem(border-radius,8);
      }
      textarea {
        width: 100%;
        .px2rem(padding-top,12);
        .px2rem(padding-bottom,11.5);
        .px2rem(padding-left,17.5);
        .px2rem(padding-right,17.5);
        .px2rem(max-height,140);
        .px2rem(line-height, 45);
        text-indent: 0 !important;
        box-sizing: border-box;
        .px2rem(border-radius,8);
        &::-webkit-scrollbar {
          display: block !important;
          .px2rem(width, 5);
          background-color: #ffffff;
        }
        &::-webkit-scrollbar-thumb {
          box-shadow: none;
          -webkit-box-shadow: none;
          background-color: #d8d8d8;
        }
        ::-webkit-scrollbar-track {
          background-color: white;
        }
        &::-webkit-input-placeholder {
          /* WebKit browsers */
          text-indent: 0 !important;
        }
        &::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          text-indent: 0 !important;
        }
        &:-ms-input-placeholder {
          /* Internet Explorer 10+ */
          text-indent: 0 !important;
        }
      }
      .textarea-scroll {
        overflow: scroll;
      }
    }
    .forward-btn {
      .px2rem(height,98);
      font-size: 0;
      // border-top: 1px solid #d9d9d9;
      width: 100%;
      .px2rem(margin-top,20);
      a {
        width: 50%;
        border: none;
        //   background-color: white;
        //   height: 100%;
        .px2rem(height,97);
        .px2rem(margin-top,1);
        color: #999999;
        position: relative;
        //   .px2rem(border-radius,8);
        display: inline-block;
        text-align: center;
        .px2rem(line-height,98);
      }
      a:active {
        background-color: #f2f3f5;
        color: #108ee9;
      }
      .confirm-btn {
        color: #108ee9;
        .px2rem(border-bottom-right-radius,8);
      }
      .cancel-btn {
        .px2rem(border-bottom-left-radius,8);
      }
      .cancel-btn:after {
        content: '';
        // top: .34rem;
        .px2rem(top,34);
        bottom: 0;
        position: absolute;
        width: 1px;
        // height: .3rem;
        .px2rem(height,30);
        background-color: #d9d9d9;
        right: 0;
      }
    }
  }
}
</style>


