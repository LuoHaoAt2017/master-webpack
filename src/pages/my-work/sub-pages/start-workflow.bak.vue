<template>
    <div id="start-workflow">
      <app-search :source="appGroups" @onToggleSearch="onToggleSearch" @onItemClick="startWorkflow">
      </app-search>
      <!-- <h3-blank-page :showButton="false" v-if="appGroups.length === 0" /> -->
      <app-manager v-show="!isSearch" v-if="appGroups.length > 0" :app-groups="appGroups" :tab-apps="apps" 
        card-class="app-card-plain" @onAppClick="startWorkflow" :wrapper-top="44">
        <template slot='modal' slot-scope="{gotoApp, selectedApp}">
          <h3-list class="app-manager-list" :has-bottom-line="false">
            <h3-radio-item v-for="item in apps" :key="item.SchemaCode" :value="item.SchemaCode" :returnValue="selectedApp" name="appGroup" @onClick="gotoApp(item.SchemaCode)">
              <span>{{item.DisplayName}}</span>
            </h3-radio-item>
          </h3-list>
        </template>
      </app-manager>
    </div>
</template>
<script>
import H3PluginDeveloper from '../../../lib/h3-plugins-developer';
import { getAppDatas } from '../../../service/get-data';
import { setTitle, setLeft } from '../../../config/dingtalk-interface';
import smartForm from '../../../lib/smart-form';
import appMixin from '../../../mixins/app-manager';
// h3 widgets
import { h3List } from '../../../../packages/components/h3-list';
import h3RadioItem from '../../../../packages/components/h3-radio/h3-radio-item';
// components
import AppManager from '../../../components/app/app-manager';
import AppSearch from '../../../components/app/app-search';

const recentAppCode = 'SYS_RecentModule';

export default {
  name: 'startWorkflow',
  components: {
    h3List,
    h3RadioItem,
    AppManager,
    AppSearch,
  },
  data() {
    return {
      apps: [],
      appGroups: [],
      isSearch: false,
    };
  },
  mixins: [appMixin],
  created() {
    const appCode = this.$store.state.appCode || '';
    const solutionCode = this.$store.state.solutionCode;
    const appType = this.$store.state.appType || '0';
    this.requestAppData(appCode, solutionCode, appType, true);
  },
  activated() {
    if (this.apps.length > 0) {
      const customOrderResult = this.getCustomAppOrder(this.apps, this.appGroups);
      if (customOrderResult) {
        this.apps = customOrderResult.apps;
        this.appGroups = customOrderResult.appGroups;
      }
    }
    setTitle('发起流程');
    setLeft(() => {
      this.goBack();
    });
  },
  methods: {
    // 获取所有分组应用 | 合并的
    async requestAppData(appCode, solutionCode, appType, workflowOnly) {
      H3PluginDeveloper.IShowPreLoader('数据加载中');
      const res = await getAppDatas(appCode, solutionCode, appType, false, workflowOnly);
      H3PluginDeveloper.IHidePreLoader();
      if (res.Successful) {
        let apps = res.ReturnData.Apps;
        let appGroups = res.ReturnData.AppGroups;
        const recentModules = res.ReturnData.RecentModules || [];
        if (recentModules.length > 0) {
          const recentAppGroup = {
            GroupCode: recentAppCode,
            AppCode: recentAppCode,
            DisplayName: '最近发起',
            Childrens: recentModules,
          };
          appGroups.unshift(recentAppGroup);
          apps.unshift({
            SchemaCode: recentAppCode,
            DisplayName: '最近发起',
          });
        }
        appGroups = appGroups.filter((group, groupIndex) => {
          if (group.Childrens.length > 0) {
            const groupTemp = group;
            groupTemp.groupOrder = groupIndex;
            Object.freeze(group); // 冻结对象，vue不再监测变化，优化性能
            group.Childrens.forEach((form) => {
              const formChild = form;
              formChild.appIconClass = this.getAppIconClass(form);
            });
            return true;
          }
          return false;
        });
        const customOrderResult = this.getCustomAppOrder(apps, appGroups);
        if (customOrderResult) {
          apps = customOrderResult.apps;
          appGroups = customOrderResult.appGroups;
        }
        this.appGroups = appGroups;
        this.apps = apps;
      }
    },
    goBack() {
      this.$router.goBack();
    },
    startWorkflow(form) {
      this.$store.state.childRenderedLen = 0;
      this.$store.state.gridChildLen = 0;
      // 进入表单页面之前把smartform之前存的表单控件清空
      this.initSmartFormControls();
      this.$router.push({
        name: 'formPage',
        params: {
          schemaCode: form.SchemaCode,
        },
        query: {
          schemaCode: form.SchemaCode,
        },
      });
    },
    onToggleSearch(payLoad) {
      this.isSearch = payLoad.isSearch;
    },
    // 初始化smartform里面的controls和自定义代码函数
    initSmartFormControls() {
      const dataFields = Object.keys(smartForm.controls);
      if (dataFields.length > 0) {
        for (const dataField of dataFields) {
          delete smartForm[dataField];
        }
        smartForm.controls = {};
      }
      smartForm.components = [];
      smartForm.mappingControlsVal = {};
      Object.assign(smartForm, {
        OnLoad() {},
        OnLoadActions() {},
        OnValidate() {
          return true;
        },
        BeforeSubmit() {},
        AfterSubmit() {},
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$root.eventHub.$emit('clear-init');
    this.$store.state.excludeComp = [];
    next();
  },
};
</script>
<style lang="less">
@import "../../../styles/common.less";
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
#start-workflow {
  input,
  textarea {
    user-select: auto;
    -webkit-user-select: auto;
  }
}
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  // -webkit-overflow-scrolling: touch;
}

</style>


