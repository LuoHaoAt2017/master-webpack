<template>
  <layout
    title="管理常用表单"
    :leftOptions="{ preventGoBack: true }"
    @on-click-back="cancel()"
  >
    <div id="favoriate-setting">
      <template v-if="!noApps">
        <div class="add-tip" v-show="isTipShow">
          最多添加8个
        </div>
        <app-select :items="commonForms" @remove="removeCommonForm" @appsRowBreak="appsRowBreak">
        </app-select>
        <app-manager v-if="appGroups.length > 0" :app-groups="appGroups" :tab-apps="apps" :wrapper-top="wrapperTop"
          page="setting" app-class="app-common-content" @onAppClick="addToCommon">
          <template slot="modal" slot-scope="{gotoApp, selectedApp}">
            <h3-list class="app-manager-list" :has-bottom-line="false">
              <h3-radio-item v-for="item in apps" :key="item.SchemaCode" :value="item.SchemaCode" :returnValue="selectedApp" name="appGroup" @onClick="gotoApp(item.SchemaCode)">
                <span>{{item.DisplayName}}</span>
              </h3-radio-item>
            </h3-list>
          </template>
        </app-manager>
        <div class="bottom-buttons">
          <div class="button cancel" @click="cancel()">
              取消
          </div>
          <div class="button ok" @click="ok()">
              完成
          </div>
        </div>
      </template>
      <template v-else>
        <h3-blank-page tip-text="暂无任何应用及表单" :show-button="false">
        </h3-blank-page>
      </template>
    </div>
  </layout>
</template>

<script>
// yjh
import { getAppDatas, setUserFavoriteFunctions } from '../../../service/get-data';
import { debounce } from '../../../config/common';
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import appMixin from '../../../mixins/app-manager';

// h3 widgets
import h3List from '../../../../packages/components/h3-list/h3-list';
import h3RadioItem from '../../../../packages/components/h3-radio/h3-radio-item';
import h3BlankPage from '../../../../packages/widgets/h3-blank-page/index';

// components
import AppManager from '../../../components/app/app-manager';
import AppSelect from '../../../components/app/app-select';

const recentAppCode = 'SYS_RecentModule';
const iconColorsMap = ['#FF4384', '#7457FF', '#FF7527', '#05DB9B', '#FFCA00']; // 其实只取长度
const iconColorsLimit = 3;

export default {
  name: 'favoriatesetting',
  components: {
    h3List,
    h3RadioItem,
    h3BlankPage,
    AppManager,
    AppSelect,
  },
  data() {
    return {
      edited: false,
      noApps: false,
      appCode: '',
      solutionCode: '',
      appType: '0',
      appGroups: [],
      apps: [],
      wrapperTop: 0,
      isTipShow: false,
      commonForms: [],
      confirmText: '你的修改未保存，是否需要保存？',
      colors: ['#F57C68', '#F7B55D', '#7EA6EA', '#2DCFA4', '#3AD1DF'],
      tipTimer: null
    };
  },
  mixins: [appMixin],
  created() {
    this.noApps = this.$store.state.noApps;
    if (!this.noApps) {
      for (let i = 0, len = this.$store.state.favoriteFunctions.length; i < len; i += 1) {
        const menu = this.$store.state.favoriteFunctions[i];
        console.log(menu)
        this.commonForms.push({
          Code: menu.Code || menu.SchemaCode,
          SchemaCode: menu.Code || menu.SchemaCode,
          AppCode: menu.AppCode,
          DisplayName: menu.DisplayName,
          Active: true,
          IconCss: menu.IconCss,
          ParentCode: menu.ParentCode,
          Color: this.colors[i % 5],
          ObjectId: menu.ObjectId
        });
      }
      this.appCode = this.$store.state.appCode;
      this.solutionCode = this.$store.state.solutionCode;
      this.appType = this.$store.state.appType || '0';
      this.requestAppData(this.appCode, this.solutionCode, this.appType);
    }
    this.addToCommon = debounce(this.addToCommon, 500, {
      leading: true,
      maxWait: 500,
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.state.excludeComp = ['favoriatesetting'];
    next();
  },
  methods: {
    async requestAppData(appCode, solutionCode, appType) {
      H3PluginDeveloper.IShowPreLoader('数据加载中...');
      const res = await getAppDatas(appCode, solutionCode, appType, false);
      H3PluginDeveloper.IHidePreLoader();
      if (res.Successful) {
        let apps = res.ReturnData.Apps;
        let appGroups = res.ReturnData.AppGroups;
        let groupIndex = 0;

        const recentModules = res.ReturnData.RecentModules || [];
        const hasRecent = recentModules.length > 0;
        // 遍历应用分组数据，将索引储存到对应表单，用于快速查询，优化性能
        appGroups = appGroups.filter((group) => {
          if (group.Childrens && group.Childrens.length === 0) {
            return false;
          }

          const groupTemp = group;
          groupTemp.groupOrder = groupIndex;
          const allGroupIndex = hasRecent ? groupIndex + 1 : groupIndex;
          const commonHitGroup = this.commonForms.filter((item) => {
            const commonForm = item;
            if (commonForm.ParentCode === group.GroupCode) {
              // remove : appGroup -(groupIndex)-> common
              commonForm.groupIndex = allGroupIndex;
              return true;
            }
            return false;
          });
          const groupInCommon = commonHitGroup.length > 0;
          const recentHitGroup = recentModules.filter((item) => {
            const recentForm = item;
            if (recentForm.ParentCode === group.GroupCode) {
              recentForm.groupIndex = allGroupIndex;
              // add : appGroup -(groupIndex)-> recent
              return true;
            }
            return false;
          });
          const groupInRecent = recentHitGroup.length > 0;
          group.Childrens.forEach((item) => {
            const form = item;
            form.appIconClass = this.getAppIconClass(item);
            if (groupInCommon) {
              const formInCommon = commonHitGroup.some(commonForm =>
                commonForm.SchemaCode === form.SchemaCode);
              if (formInCommon) {
                form.Active = true;
              }
            }
            if (groupInRecent) {
              const formInRecent = recentHitGroup.some(commonForm =>
                commonForm.SchemaCode === form.SchemaCode);
              if (formInRecent) {
                form.isInRecent = true;
                // add : recent -(isInRecent)-> appGroup
              }
            }
          });
          groupIndex += 1;
          return true;
        });
        if (hasRecent) {
          recentModules.forEach((recentModule) => {
            const form = recentModule;
            form.isRecentForm = true;
            form.appIconClass = this.getAppIconClass(recentModule);
            if (this.commonForms.length > 0) {
              const commonHitRecent = this.commonForms.find(commonForm =>
                commonForm.SchemaCode === form.SchemaCode);
              if (commonHitRecent) {
                form.Active = true;
                commonHitRecent.isInRecent = true;
                // remove : recent -(isInRecent)-> common
              }
            }
          });
          const recentAppGroup = {
            AppCode: recentAppCode,
            GroupCode: recentAppCode,
            DisplayName: '最近使用',
            Childrens: recentModules,
          };
          appGroups.unshift(recentAppGroup);
          apps.unshift({
            SchemaCode: recentAppCode,
            DisplayName: '最近使用',
          });
        }
        const customOrderResult = this.getCustomAppOrder(apps, appGroups);
        if (customOrderResult) {
          apps = customOrderResult.apps;
          appGroups = customOrderResult.appGroups;
        }
        this.appGroups = appGroups;
        this.apps = apps;
      }
    },
    async setFavoriteFunctions(solutionCode, commonFunctions) {
      this.$store.state.favoriteFunctions = commonFunctions;
      const functionCodeArr = commonFunctions.map(menu => (menu.SchemaCode || menu.Code));
      const functionCodes = functionCodeArr.join(';');
      const res = await setUserFavoriteFunctions(solutionCode, functionCodes);
      if (res.Successful) {
        H3PluginDeveloper.IShowTip('提示', '设置成功', true, 1000, false);
        this.$root.eventHub.$emit('Update-FavoriteFunctions', commonFunctions);
        this.goBack(-1);
      } else {
        H3PluginDeveloper.IShowError('错误', res.ErrorMessage, true, 1000, false);
      }
    },
    /* */
    appsRowBreak(wrapperTop) {
      this.wrapperTop = wrapperTop;
    },
    addToCommon(item, groupIndex) {
      const form = item;
      if (form.Active) {
        return;
      }

      if (this.commonForms.length >= 8) {
        this.showTip()
      } else {
        this.edited = true;
        const newCommonForm = Object.assign({}, form);
        form.Active = true;
        // 查找索引以及为新增的表单添加索引
        if (form.isRecentForm || (!form.isRecentForm && form.isInRecent)) {
          // 当前点击最近使用 || 不是最近使用但最近使用中有这个表单
          const formGroupIndex = form.isRecentForm ? form.groupIndex : 0;
          const group = this.appGroups[formGroupIndex];
          this.toggleFormActive(group, form.SchemaCode, true);
          newCommonForm.groupIndex = form.isRecentForm ? form.groupIndex : groupIndex;
          // remove : appGroup -(groupIndex)-> common
          newCommonForm.isInRecent = true;
          // remove : recent -(isInRecent)-> common
        } else {
          // 不在最近使用中的表单
          newCommonForm.groupIndex = groupIndex;
        }
        console.time('add-form');
        this.commonForms.push(newCommonForm);
      }
    },
    removeCommonForm(item) {
      this.edited = true;
      // 查找正常分组索引
      if (item.groupIndex > 0) {
        const group = this.appGroups[item.groupIndex];
        this.toggleFormActive(group, item.SchemaCode, false);
      } else {
        // 出现错误未找到索引，调用全局遍历查找
        console.warn('err:未找到常用表单索引');
        this.setAppGroupsActive(item, false);
      }
      // 查找最近使用索引
      if (item.isInRecent) {
        const group = this.appGroups[0];
        this.toggleFormActive(group, item.SchemaCode, false);
      }
    },
    toggleFormActive(group, schemaCode, active) {
      for (const child of group.Childrens) {
        if (child.SchemaCode === schemaCode) {
          this.$set(child, 'Active', active);
          break;
        }
      }
    },
    setAppGroupsActive(item, active) {
      const appGroup = this.appGroups.find(group => group.AppCode !== recentAppCode
        && group.AppCode === item.AppCode && group && group.GroupCode === item.ParentCode);
      if (appGroup) {
        this.toggleFormActive(appGroup, item, active);
      }
    },
    getAppIconClass(item) {
      let classStr = `font-icon ${item.IconCss}`;
      let left;
      if (item.ObjectId) {
        const substr = item.ObjectId.substr(-iconColorsLimit);
        let long = 0;
        for (let i = 0; i < substr.length; i++) {
          const s = substr[i];
          const l = s.charCodeAt(0);
          long += l;
        }
        left = long % iconColorsMap.length;
      } else {
        left = Math.floor(Math.random() * iconColorsMap.length);
      }
      classStr = `${classStr} app-icon-color-${left + 1}`;
      return classStr;
    },
    //显示提示
    showTip() {
      if(this.tipTimer){
        clearTimeout(this.tipTimer)
      }
      this.isTipShow = true
      setTimeout(() => {
        this.isTipShow = false
      }, 3000)
    },
    goBack() {
      this.$router.goBack();
    },
    ok() {
      const solutionCode = this.appCode || this.solutionCode;
      this.setFavoriteFunctions(solutionCode, this.commonForms);
    },
    cancel() {
      const self = this;
      if (this.edited) {
        this.$h3.modal.show({
          content: self.confirmText,
          type: 'alert',
          actions: [
            {
              text: '不保存',
              onPress() {
                self.goBack();
              },
            },
            {
              text: '保存',
              onPress() {
                self.ok();
              },
            },
          ],
        });
      } else {
        this.goBack();
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../../assets/css/home.less';
#favoriate-setting {
  position: absolute;
  top: 0;
  bottom: 44px;
  left: 0;
  width: 100%;
  overflow:hidden;
  -webkit-overflow-scrolling:touch;
  div.bottom-buttons {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    .px2rem(height,88);
    z-index: 900;
    display: flex;
    div.button {
      border-top: 1px solid #e4e4e4;
      box-sizing: border-box;
      height: 100%;
      .px2rem(line-height,88);
      .px2rem(font-size,32);
      flex-basis: 50%;
      text-align: center;
    }
    div.cancel {
      background: #fff;
    }
    div.ok {
      background: #1890ff;
      color: #fff;
    }
  }
  .fixedTip{
    position: fixed;
    width: 100%;
    z-index: 99;
    .px2rem(height, 72);
    .px2rem(top, 0);
    .px2rem(left, 0);
    background:rgba(0,0,0,0.75);
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
    .px2rem(font-size, 28);
    .px2rem(line-height ,72);
    color:#fff;
  }
  .fixedTip{
    position: fixed;
    width: 100%;
    z-index: 99;
    .px2rem(height, 72);
    .px2rem(top, 0);
    .px2rem(left, 0);
    background:rgba(0,0,0,0.75);
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
    .px2rem(font-size, 28);
    .px2rem(line-height ,72);
    color:#fff;
  }
  .add-tip{
    display: inline-block;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    min-width: 60px;
    border-radius: 3px;
    color: #fff;
    background-color: rgba(58, 58, 58, 0.9);
    line-height: 1.5;
    padding: 9px 15px;
    z-index: 9999;
  }
}
</style>
