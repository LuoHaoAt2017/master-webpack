<template>
<!-- lbb修改代码规范 -->
        <layout :title="title">
        <div class="user-deparment-choose-page">
            <user-department-choose :routeParams='routeParams' :entry-type="entryType" ></user-department-choose>
        </div>
        <transition :duration='300' enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="share-panel" v-if="isOk">
                <div class="wrapper">
                    <div class="title">
                        分享链接给：
                    </div>
                    <div class="users">
                        <div v-if="users.length==1" :style="{background:colors[0]}">
                            <img :src="users[0].Avatar" v-if="users[0].Avatar"/>
                            <span v-if="!users[0].Avatar">{{users[0].DisplayName.substr(0,1)}}</span>
                        </div>
                        <span v-if="users.length==1">{{users[0].DisplayName}}</span>
                        <div v-for="(user,index) in users" :key="index" v-if="users.length>1" :style="{background:colors[index]}">
                            <img :src="user.Avatar" v-if="user.Avatar" />
                            <span  v-if="!user.Avatar">{{user.DisplayName.substr(0, 1)}}</span>
                        </div>
                    </div>
                    <div class="content">
                        {{displayName}}
                    </div>
                    <div class="message">
                        <textarea rows="1" v-model="message" placeholder="留言"></textarea>
                    </div>
                    <div class="buttons">
                        <div class="buttons-wrapper">
                            <div class="cancel" @click="cancel()">取消</div>
                            <div class="divider"></div>
                            <div class="ok" @click="ok()">确定</div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </transition>
        </layout>
</template>
<script>
import userDepartmentChoose from '../../components/organization/user-department-choose-node.vue';
import { UserSelectEntryType } from '../../config/common';
import { pickConversation } from '../../config/dingtalk-interface';

export default {
  name: 'shareselect',
  components: {
    userDepartmentChoose,
  },
  data() {
    return {
      isOk: false,
      message: null,
      title: '选择人员',
      url: null,
      displayName: null,
      routeParams: {
        showUnActive: false,
        userVisible: true,
        orgUnitVisible: false,
        isMultiple: 'true',
      },
      entryType: UserSelectEntryType.Share,
      users: [],
      colors: ['#956FEA', '#FFAD69', '#00A2FF', ' #46CFB6', '#5CD5FC'],
    };
  },
  created() {
    const that = this;
    this.url = this.$route.params.url;
    this.displayName = this.$route.params.displayName;
    this.$root.eventHub.$on('assignVal', (val) => {
      that.users = val;
      that.isOk = true;
    });
  },
  methods: {
    ok() {
      // todo 分享
      if (this.users.length > 0) {
        /* eslint-disable */
        for (const user of this.users) {
          pickConversation(this.$store.state.corpId, () => {});
        }
      }
    },
    cancel() {
      this.isOk = false;
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },
};
</script>
<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.share-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9;
  div.wrapper {
    .px2rem(width,570);
    .px2rem(min-height,343);
    .px2rem(border-radius,25);
    .px2rem(padding-top,24);
    .px2rem(padding-bottom,24);
    background-color: #fefefe;
    margin-left: 50%;
    transform: translateX(-50%);
    .px2rem(margin-top,308);
    position: relative;
    div.title {
      .px2rem(height,45);
      .px2rem(font-size,32);
      .px2rem(margin-left,24);
      .px2rem(margin-right,24);
      color: #333;
    }
    div.users {
      .px2rem(padding-top,20);
      .px2rem(padding-bottom,20);
      .px2rem(margin-left,24);
      .px2rem(margin-right,24);
      border-bottom: 1px solid #d9d9d9;
      // overflow: hidden;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      div {
        float: left;
        .px2rem(width,56);
        .px2rem(height,56);
        .px2rem(margin-right,24);
        .px2rem(margin-bottom,24);
        .px2rem(line-height,56);
        border: 1px solid silver;
        text-align: center;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
    div.content {
      .px2rem(margin-top,33);
      .px2rem(margin-bottom,33);
      .px2rem(margin-left,24);
      .px2rem(margin-right,24);
      .px2rem(height,45);
      .px2rem(line-height,45);
      .px2rem(font-size,32);
      color: #333;
    }
    div.message {
      .px2rem(font-size,32);
      .px2rem(padding-bottom,10);
      .px2rem(margin-left,24);
      .px2rem(margin-right,24);
      // border-bottom: 1px solid #d9d9d9;
      textarea {
        outline: none;
        resize: none;
        .px2rem(min-height,80);
        border: 1px solid #d9d9d9;
        width: 100%;
        .px2rem(border-radius,8);
      }
    }
    div.buttons {
      // position:absolute;
      // bottom: 10px;
      // .px2rem(left,24);
      border-top: 1px solid #d9d9d9;
      .px2rem(padding-top,24);
      div.buttons-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-around;
        div.divider {
          border: 0;
          width: 0;
          border-left: 1px solid #d9d9d9;
        }
        div.cancel,
        div.ok {
          text-align: center;
          .px2rem(font-size,36);
        }
        div.cancel {
          color: #333;
        }
        div.ok {
          color: #108ee9;
        }
      }
    }
  }
}
</style>


