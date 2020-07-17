<template>
  <layout :title="appTitle" :leftOptions="{preventGoBack: true}" @on-click-back="goBack">
    <div id="single-app">
      <home-mywork-list />
      <div class="schema-list">
        <div
          v-for="(item, index) in schemaList"
          :key="item.GroupCode"
          :style="item.loading ? 'display: inline-block; width: 25%' : ''"
        >
          <template v-if="item.loading">
            <div
              v-if="index < 4"
              class="schema-list__loading"
            >
              <skeleton class="top" />
              <skeleton class="bottom" />
            </div>
          </template>

          <template v-else>
            <div
              class="schema-list--title dp-font28"
              @click="showSchemaList(index)"
            >
              {{ item.GroupDisplayName === '未分组' ? '无分组' : item.GroupDisplayName }}
              <i class="h3yun_All right-o" :class="{'expand': !item.fold}"></i>
            </div>
            <div
              :style="!item.fold && item.Childrens.length ? `height: ${Math.ceil(item.Childrens.length / 4) * 2.5}rem` : ''"
              class="schema-list--content"
            >
              <ul>
                <li
                  v-for="app in item.Childrens"
                  :key="app.SchemaCode"
                  @click="openForm(app)"
                >
                  <cell-list
                    :id="app.ObjectId"
                    :name="app.DisplayName"
                    :iconName="app.IconCss"
                  />
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </layout>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { State, namespace, Mutation } from 'vuex-class';
import { closeApp, hideRightMenu } from '@/config/dingtalk-interface';
import { MutationType } from '@/store/types';
import { HomeActionType } from '@/store/modules/home/types';
import { AppActionType } from '@/store/modules/app/types';
import skeleton from '@/components/common/skeleton-loading.vue';
import HomeMyworkList from '@/components/home/home-mywork-list.vue';
import CellList from '@/components/common/cell-list.vue';
import OpenFormMixin from '../../mixins/openForm';

// vuex-class module命名空间
const homeModule = namespace('Home');
const appModule = namespace('App');

const errorTip = '应用无权限或已被删除，请您联系管理员进行设置';
const updatelayout = `<p class="dp-font34" style="color: #333333;font-weight: bold;">更新啦</p>
                      <p class="dp-font24" style="color: #666;padding: 0 32px;margin-top: 7px;">发布至钉钉工作台的应用首页全新改版</p>`;

Component.registerHooks(['beforeRouteLeave']);

@Component({
  name: 'SingleApp',
  components: {
    HomeMyworkList,
    CellList,
    skeleton,
  },
})
export default class SingleApp extends Mixins(OpenFormMixin) {
  @State('appCode') appCode;

  @State('UserInfo') UserInfo;

  @appModule.State('schemaList') schemaList; // 表单列表

  @appModule.State('appTitle') appTitle; // 应用名称

  @appModule.Action(AppActionType.GetAppSchemas) getAppSchemas;

  @homeModule.Action(HomeActionType.GetMyWorkflow) getMyWorkflow;

  @Mutation(MutationType.ToggleTabbarShow) toggleTabbarShow;

  async created () {
    // const testAppCode = 'A95bf931393af4a3fbc464e97c9a31f5d'; // 登陆获取appCode
    this.toggleTabbarShow(false); // 单页应用不显示底部导航栏
    await this.getAppSchemas(this.appCode);
    this.initShowModel();
  }

  activated () {
    // 获取最新的代办数量
    this.getMyWorkflow(this.appCode);
  }

  beforeRouteLeave (to, from, next) {
    this.$store.state.excludeComp = [];
    hideRightMenu();
    next();
  }

  goBack () {
    closeApp();
  }

  /**
   *  展开当前目录下表单
   *  @param index 索引
   */
  showSchemaList (index) {
    this.schemaList[index].fold = !this.schemaList[index].fold;
  }

  /**
   *  第一次进入单页应用首页时提示弹窗/或判断是狗关闭应用
   */
  initShowModel () {
    const readTip = localStorage.getItem(`${this.$store.state.UserInfo.userId}-visit-single-app`);
    if (!this.schemaList || this.schemaList.length < 1) {
      this.$h3.modal.show({
        maskClosable: false,
        title: '温馨提示',
        content: errorTip,
        type: 'alert',
        actions: [{
          text: '知道了',
          onPress: () => {
            closeApp();
          },
        }],
      });
    } else if (!readTip) {
      this.$h3.modal.show({
        maskClosable: true,
        title: '<i class="single-app-update-layout"></i>',
        content: updatelayout,
        type: 'alert',
        onShow: this.setLoacalStorage(),
        actions: [{
          text: '体验一下',
          onPress: () => {
            this.setLoacalStorage();
          },
        }],

      });
    }
  }

  /**
   *  缓存第一次进入页面的参数
   */
  setLoacalStorage () {
    localStorage.setItem(`${this.$store.state.UserInfo.userId}-visit-single-app`, 'true');
  }
}
</script>
<style lang="less">
@import '../../styles/mixins.less';
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.common-padding() {
  .px2rem(padding-right, 30);
  .px2rem(padding-left, 30);
}
#single-app {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  background-color: #F5F7F9;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  .mywork-list {
    .common-padding();
    .px2rem(padding-top, 55);
    .px2rem(padding-bottom, 28);
    .px2rem(margin-bottom, 20);
    background-color: #fff;
    min-height: 10px;
  }
  .schema-list{
    background-color: #fff;
    &__loading{
      padding: 15px;
      box-sizing: border-box;
      display: inline-block;
      height: 90px;
      .top{
        height: 50px;
        width: 50px;
      }
      .bottom{
        margin-top: 4px;
        height: 20px;
      }
    }
    &--title{
      position: relative;
      .common-padding();
      .px2rem(height, 120);
      .px2rem(line-height, 40);
      .px2rem(padding-top, 40);
      box-sizing: border-box;
      color: #333;
      font-weight: bold;
      .hairline('bottom', #F6F6F6);
      .right-o{
        color:#BFC3CB;
        font-weight: normal;
        padding: 4px;
        float: right;
        transition: transform 0.15s ease;
        &.expand {
          transform: rotate(90deg);
        }
      }
    }
    &--content{
      position: relative;
      height: 0;
      overflow: hidden;
      transition: height 0.15s ease, opacity 0.15s ease;
      .common-padding();
      .hairline('bottom', #F6F6F6);
      ul{
        display: flex;
        flex-wrap: wrap;
        li{
          flex-basis: 25%;
        }
      }
    }
  }
}
</style>
