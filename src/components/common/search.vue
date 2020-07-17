<template>
  <div class="header-search-wrapper" :class="{'overflow': !searchLayerShow}">
    <form :style="{width: searchLayerShow ? '80%' : '100%'}" class="header-search" action="javascript:return true" >
      <i class="magnifier h3yun_All search-o fa box-icon"></i>
      <input
        ref="headerSearch"
        v-model.trim="searchContent"
        class="search-input"
        type="search"
        :placeholder="getPlaceholder"
        @click="onFocus"
        @blur="onBlur"
        @keyup.enter="doSearch"
        @keyup.esc="searchContent = ''"
      />
      <i
        class="clear h3yun_All close fa box-icon"
        :style="{visibility: searchContent.length ? 'visible' : 'hidden'}"
        @click="clearSearchContent"
      ></i>
    </form>
    <span
      v-if="searchLayerShow && searchInputFocus"
      class="search-cancel"
      @click="doSearch"
    >搜索</span>
    <span
      v-if="searchLayerShow && !searchInputFocus"
      class="search-cancel"
      @click="closeSeachLayer"
    >取消</span>
    <transition
      name="search-layer"
      mode="out-in"
    >
      <div
        v-show="searchLayerShow"
        class="search-layer"
        :style="{top: correctLayerTop}"
      >
        <div
          v-if="searched"
          class="search-result"
        >
          <div class="search-result-wrapper">
            <span class="search-count">搜索结果：共{{ searchList.length + searchLocalList.length }}条</span>
            <ul
              v-if="!schema"
              class="search-app-list"
            >
              <template v-for="app in searchLocalList">
                <li
                  v-if="app.Code !== 'Sys_Workflow'"
                  :key="app.ObjectId"
                  class="list-item"
                  @click="openApp(app)"
                >
                  <cell-list
                    :id="app.ObjectId"
                    :isHtml="true"
                    :name="app.DisplayName"
                    iconType="round"
                    :iconName="app.IconCss || 'icon-Personnel_021'"
                  />
                </li>
              </template>
            </ul>
            <transition
              name="search-result"
              mode="out-in"
            >
              <div v-if="!isLightApp">
                <ul
                  v-if="!searchLoading && searched"
                  class="search-schema-list test1"
                >
                  <li
                    v-for="schema in searchList"
                    :key="schema.Code"
                    class="list-item"
                    @click="openSchema(schema)"
                  >
                    <i
                      :style="{color: getIconColor(schema.ObjectId)}"
                      class="schema-icon fa box-icon h3yun_All"
                      :class="`${schema.IconCss}-o`"
                    ></i>
                    <span
                      class="schema-name"
                      v-html="schema.DisplayName"
                    ></span>
                    <span
                      v-if="schema.NodeType !== 200 && schema.NodeType !== 240 && schema.NodeType !== 300"
                      class="schema-type"
                      :class="{'workflow': schema.NodeType === 210, 'dashboard': schema.NodeType === 270}"
                    >{{ schema.NodeType | formatSchemaType(schema.NodeType) }}</span>
                  </li>
                </ul>
              </div>

              <!-- 轻应用表单搜索 -->
              <div v-if="schema && isLightApp">
                <ul
                  v-if="!searchLoading && searched && isLightApp"
                  class="search-schema-list test2"
                >
                  <li
                    v-for="(schema, itemIndex) in searchList"
                    :key="schema.Code"
                    class="light-list-item bd-bot"
                  >
                    <!-- <i
                      :style="{color: getIconColor(schema.ObjectId)}"
                      class="schema-icon fa box-icon h3yun_All cloud-o"
                    ></i> -->
                    <i
                      class="schema-icon fa box-icon h3yun_All table-o"
                    ></i>
                    <span
                      class="schema-name"
                      v-html="schema.DisplayName"
                      @click="openLightForm(schema)"
                    ></span>
                    <i
                      v-if="operationPermission && schema.NodeType !== 270"
                      class="icon h3yun_All ellipsis-o"
                      @click="handleSettingSheetShow(schema, itemIndex)"
                    ></i>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
        </div>
        <div
          v-else
          class="mask"
          @click="closeSeachLayer"
          @touchmove.prevent.stop
        ></div>
      </div>
    </transition>
    <!-- 轻应用 -->
    <div class="setting-dropdown-menu">
      <h3-actionsheet
        v-model="actionSettingSheetShow"
        :menus="settingMenus"
        show-cancel
        @on-click-menu="onClickSettingMenu"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import {
  searchSchema,
  getLastBizObjectIdBySchema,
} from '@/service/app.service';
import cellList from '../../components/common/cell-list.vue';
import calcIconColor from '@/utils/calc-icon-color';
import { htmlEscape } from '@/utils';
import { MutationType } from '@/store/types';
import { AppActionType, AppMutationType } from '@/store/modules/app/types';
import { LightAppMutationType } from '@/light-app/store/types';
import { H3Actionsheet } from 'h3-mobile-vue';
import App = H3.App;

// vuex-class module命名空间
const appModule = namespace('App');
const lightAppModule = namespace('LightApp');
const NodeType = {
  // 190: '应用程序',
  200: '非流程', // 列表模块（不能发起流程）
  210: '流程', // 流程列表模块（可以发起流程）
  220: '报表', // 报表模块
  // 230: '分组', // 节点分组
  240: '非流程', // 表单模块（无列表，单行数据）
  250: '流程', // 流程列表模块（可以发起流程）
  300: '自定义表单', // 自定义列表模块（不含表单）
  270: '仪表盘', // 自定义列表模块（不含表单）
};

@Component({
  components: {
    cellList,
    H3Actionsheet,
  },
  filters: {
    formatSchemaType (val: number) {
      return NodeType[val];
    },
  },
})
export default class SearchLayer extends Vue {
  @Prop({ default: false })
  schema!: boolean;

  @appModule.Getter('operationPermission') operationPermission; // 表单操作权限控制

  @appModule.State('appList') appList; // 应用列表

  @appModule.State('schemaList') schemaList; // 表单列表

  @appModule.State('isLightApp') isLightApp; // 判断是否为轻应用表单

  @Mutation(MutationType.ToggleTabbarShow) toggleTabbarShow;

  @appModule.Mutation(AppMutationType.DelSheetIndex) delSheetIndex;

  @appModule.Action(AppActionType.DelSheet) delSheet;

  @appModule.Mutation(AppMutationType.HandleRenameSheetsIndex)
  handleRenameSheetsIndex;

  @lightAppModule.Mutation(LightAppMutationType.SelectFormObjectId)
  selectFormObjectId; // 选中表单ObjectId

  settingSheetShow: boolean = false;

  selectSheetName: null;

  selectSheetCode: null;

  selectSheetObjectId: null;

  renameSheetIndex: number = -1;

  searchList: any = [];

  searchLocalList: any = [];

  searchLayerShow: boolean = false;

  searchContent: string = ''; // 搜索文字

  searchInputFocus: boolean = false; // 搜索浮层显示状态

  searchLoading: boolean = true; // 搜索加载状态

  searchNoResult: boolean = true; // 是否无数据

  searched: boolean = false;

  actionSettingSheetShow: boolean = false;

  settingMenus: any[] = [
    {
      label: '设计表单',
      value: 'design'
    },
    // {
    //   label: '邀请他人填单',
    //   value: 'share'
    // },
    {
      label: '重命名',
      value: 'rename'
    },
    {
      label: '删除',
      type: 'error',
      value: 'del'
    }
  ];

  get getPlaceholder ():string {
    const listPlace = this.isLightApp ? '搜索数据表/报表' : '搜索表单/报表';
    return this.schema ? listPlace : '搜索应用/表单/报表'
  }

  get correctLayerTop (): string {
    if (process.env.NODE_ENV === 'development') {
      return '2.76667rem';
    }
    return '';
  }

  get correctInputTop (): string {
    if (process.env.NODE_ENV === 'development') {
      return '1.34667rem';
    }
    return '';
  }

  onSettingCancel () {
    this.actionSettingSheetShow = false;
  }

  // 轻应用列表设置操作
  onClickSettingMenu (key) {
    switch (key) {
      case 'cancel':
        this.onSettingCancel();
        break;
      case 'design':
        this.handleRouterFormDesign();
        break;
      case 'share':
        this.handleRouterFormShare();
        break;
      case 'rename':
        this.handleRouterNameEdit();
        break;
      case 'del':
        this.handleDelSheetModel();
        break;
      default:
        break;
    }
  }

  handleSettingSheetShow (schema, index: number) {
    this.selectSheetName = schema.originName;
    this.selectSheetCode = schema.Code;
    this.selectSheetObjectId = schema.ObjectId;
    this.actionSettingSheetShow = true;
    this.delSheetIndex(index);
    this.handleRenameSheetsIndex(index);
    this.renameSheetIndex = index;
    this.selectFormObjectId(schema.ObjectId);
  }

  handleRouterNameEdit () {
    this.settingSheetShow = false;
    const { appCode } = this.$route.query;
    this.backStack.pop();
    this.$router.push({
      name: 'lightFormNameEditPage',
      query: {
        appCode: appCode,
        sheetCode: this.selectSheetCode,
        index: `${this.renameSheetIndex}`
      }
    });
  }

  handleRouterFormDesign () {
    this.settingSheetShow = false;
    const { appCode } = this.$route.query;
    this.backStack.pop();
    this.$router.push({
      name: 'lightFormDesignPage',
      query: {
        appCode: appCode,
        formStatus: 'edit',
        formCode: this.selectSheetCode,
        formName: this.selectSheetName,
      }
    });
  }

  handleRouterFormShare () {
    this.settingSheetShow = false;
    const { appCode } = this.$route.query;
    this.backStack.pop();
    this.$router.push({
      name: 'lightFormSharePage',
      query: {
        appCode: appCode,
        formCode: this.selectSheetCode,
        formName: this.selectSheetName,
        formObjectId: this.selectSheetObjectId,
      }
    });
  }

  handleDelSheetModel () {
    this.settingSheetShow = false;
    this.$h3.modal.show({
      content: '是否删除表单',
      type: 'alert',
      actions: [
        {
          text: '取消',
          onPress: () => {}
        },
        {
          text: '确认',
          onPress: () => {
            this.deleteForm();
            this.closeSeachLayer();
          }
        }
      ]
    });
  }

  deleteForm () {
    this.delSheet(this.selectSheetCode);
  }

  onFocus () {
    (this.$refs.headerSearch as any).focus();
    this.searchInputFocus = true;
    this.searchLayerShow = true;
    this.toggleTabbarShow(false);
    this.backStack.push(() => {
      this.closeSeachLayer();
    });
  }

  onBlur () {
    const timer = window.setTimeout(() => {
      this.searchInputFocus = false;
      window.clearTimeout(timer);
    }, 0);
  }

  closeSeachLayer () {
    this.backStack.pop();
    this.toggleTabbarShow(true);
    this.searchLayerShow = false;
    this.searchContent = '';
    this.searchLoading = false;
    this.searchNoResult = true;
    this.searchList = [];
    this.searchLocalList = [];
    (this.$refs.headerSearch as any).blur();
    const timer = window.setTimeout(() => {
      this.searched = false;
      window.clearTimeout(timer);
    }, 300);
  }

  clearSearchContent () {
    this.searchContent = '';
    this.closeSeachLayer();
  }

  /**
   * @description 搜索方法
   */
  async doSearch () {
    const content = this.searchContent;
    if (content === '') {
      return;
    }
    this.searchLoading = true;
    if (!this.schema) {
      this.searchLocalList = this.searchFromLocal(
        content,
        this.appList,
        'DisplayName',
      );
      this.searched = true;
      const solutionCode = this.$store.state.solutionCode;
      const appCode = this.$store.state.appCode;
      const res = await searchSchema(content, 0, 0, solutionCode, appCode);
      if (res.Successful) {
        const data = res.ReturnData.SchemaList;
        const reg = new RegExp(content, 'g');
        data.forEach(item => {
          if (item.DisplayName.includes(content)) {
            item.DisplayTitle = item.DisplayName;
            item.DisplayName = htmlEscape(item.DisplayName)
              .replace(reg, `<span style="color: #107FFF">${content}</span>`);
          }
        });
        this.searchList = data;
        this.searchLoading = false;
        if (this.searchList.length > 0) {
          this.searchNoResult = false;
        } else {
          this.searchNoResult = true;
        }
      } else {
        this.searchLoading = false;
        this.searchNoResult = false;
      }
    } else {
      this.searchList = this.searchFromLocal(
        content,
        this.schemaList,
        'DisplayName',
      );
      this.searched = true;
      this.searchLoading = false;
    }
  }

  /**
   * @description 搜索方法
   */
  searchFromLocal (searchContent: string, list: any, keyName: string) {
    const copyList = JSON.parse(JSON.stringify(list));
    const matchAppList = [];
    const reg = new RegExp(searchContent, 'g');
    copyList.forEach(item => {
      if (this.schema) {
        const child = JSON.parse(JSON.stringify(item.Childrens));
        if (child.length > 0) {
          child.forEach(c => {
            if (c[keyName].includes(searchContent)) {
              c.originName = c[keyName];
              c[keyName] = htmlEscape(c[keyName]).replace(
                reg,
                `<span style="color: #107FFF">${searchContent}</span>`
              );
              matchAppList.push(c);
            }
          });
        }
      } else {
        if (item[keyName].includes(searchContent) && item.Code !== 'Sys_Workflow') {
          item.originName = item[keyName];
          item[keyName] = htmlEscape(item[keyName]).replace(
            reg,
            `<span style="color: #107FFF">${searchContent}</span>`
          );
          matchAppList.push(item);
        }
      }
    });
    return matchAppList;
  }

  openApp (app: H3.App.AppListItem) {
    this.backStack.pop();
    this.$router.push({
      name: 'schemas',
      params: {
        appCode: app.Code,
      },
      query: {
        appCode: app.Code,
      }
    });
  }

  // todo 替换公共的mixin OPENFORM
  openSchema (schema: H3.App.SchemaListItem) {
    if (schema.NodeType === 220) {
      this.$router.push({
        name: 'report',
        params: {
          reportCode: schema.Code,
          AppCode: schema.AppCode,
        },
      });
    } else if (schema.NodeType === 240) {
      this.getLastBizObjectIdBySchemas(schema.Code);
    } else if (schema.NodeType === 270) {
      // 去到仪表盘
      this.$router.push({
        name: 'dashboard',
        query: {
          reportId: schema.Code,
          AppCode: schema.AppCode,
        },
      });
    } else {
      const appCode = schema.AppCode;
      const schemaCode = schema.Code;
      const appName = schema.originName;
      this.$root.eventHub.$emit('query-lists');
      this.$router.push({
        name: 'list',
        params: { appCode, schemaCode, appName },
        query: { schemaCode }
      });
    }
    this.backStack.pop();
  }

  async getLastBizObjectIdBySchemas (schemaCode: string) {
    const data = await getLastBizObjectIdBySchema(schemaCode);
    if (data.Successful) {
      const objectId = data.ReturnData.Data.BizObjectId;
      this.$router.push({
        name: 'formPage',
        params: {
          schemaCode,
          bizObjectId: objectId,
          showList: 'false'
        },
        query: {
          schemaCode,
          bizObjectId: objectId,
        }
      });
    } else {
      this.$router.push({
        name: 'formPage',
        params: {
          schemaCode,
          showList: 'false',
        },
        query: { schemaCode },
      });
    }
  }

  getIconColor (id) {
    return calcIconColor(id);
  }

  maskTouch (e) {
    e.stopPropagation();
  }

  // 轻应用打开表单
  openLightForm (schema: H3.App.SchemaListItem) {
    const appCode = schema.AppCode;
    const sheetCode = schema.Code;
    const sheetName = schema.originName;
    if (schema.NodeType === 270) {
      // 去到仪表盘
      this.$router.push({
        name: 'dashboard',
        query: {
          reportId: schema.Code,
          AppCode: schema.AppCode,
        },
      });
    } else {
      this.$router.push({
        name: 'lightListPage',
        query: {
          appCode,
          sheetCode,
        },
        params: {
          sheetName,
        }
      });
      this.backStack.pop();
    }
  }
}
</script>
<style lang="less">
@baseFontSize: 75;
@baseThemeColor: #107fff;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}

.header-search-wrapper {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  .px2rem(height, 108);
  background: #fff;
  border-bottom: 1px solid #ebedf2;
  &.overflow {
    overflow: hidden; //兼容处理overflow把搜索页隐藏，且overflow:hidden处理安卓手机列表第一格不能点的问题
  }
}

.header-search {
  // display: flex;
  // align-items: center;
  .px2rem(height, 72);
  .px2rem(line-height, 72);
  .px2rem(margin-left, 20);
  .px2rem(margin-right, 20);
  .px2rem(padding-left, 24);
  .px2rem(padding-right, 24);
  background: #f5f7f9;
  .px2rem(border-radius, 10);
  transition: all 0.3s ease-in-out;
  .magnifier {
    .px2rem(margin-right, 10);
    font-size: 13px;
    color: #8893a7;
  }
  .search-input {
    // flex: 1;
    width: 82%;
    .px2rem(height, 40);
    .px2rem(line-height, 40);
    border: none;
    font-size: 14px;
    outline: none;
    background: transparent;
    transition: all 0.2s ease 0.1s;
    &::-webkit-input-placeholder {
      color: #999;
    }
    // 作用：隐藏搜索框X图标
    &::-webkit-search-cancel-button {
      display: none;
    }
  }
  .clear {
    .px2rem(margin-left, 8);
    .px2rem(font-size, 24);
    color: #c9ccd8;
    cursor: pointer;
    // transform: scale(0);
    transition: all 0.15s ease;
    &.active {
      transform: scale(1);
    }
  }
}

.search-cancel {
  .px2rem(width, 100);
  .px2rem(font-size, 30);
  color: @baseThemeColor;
}

.search-layer {
  position: fixed;
  .px2rem(top, 108);
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  &-wrapper {
    min-height: 40%;
  }
  .mask {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.25);
  }
  .search-result {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: #f5f7f9;
    &-wrapper {
      min-height: 40%;
    }
    .search-count {
      display: block;
      font-size: 12px;
      color: #666;
      .px2rem(padding-left, 34);
      .px2rem(padding-top, 20);
    }
    .search-app-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
      .px2rem(margin-top, 20);
      background: #fff;
      .list-item {
        display: flex;
        justify-content: center;
        width: 33%;
        .px2rem(padding-top, 20);
      }
    }
    .search-schema-list {
      .px2rem(margin-top, 20);
      background: #fff;
      .list-item {
        display: flex;
        align-items: center;
        .px2rem(height, 108);
        .px2rem(padding-right, 30);
        border-bottom: 1px solid #ebedf2;
        &:last-of-type {
          border-bottom: none;
        }
        .schema-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          .px2rem(width, 50);
          .px2rem(margin-left, 34);
          .px2rem(margin-right, 34);
          .px2rem(font-size, 45);
        }
        .schema-type {
          display: flex;
          justify-content: center;
          align-items: center;
          .px2rem(width, 88);
          .px2rem(height, 40);
          background: #e0ecfa;
          border-radius: 20px;
          color: @baseThemeColor;
          font-size: 11px;
          &.workflow {
            background: rgba(32, 207, 48, 0.1);
            color: #069913;
          }
          &.dashboard {
            background: rgba(255,117,39,0.1);
            color: #FF7527;
          }
        }
        .schema-name {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

.search-layer-enter-active {
  transition: all 0.3s ease-in;
}
.search-layer-leave-active {
  transition: all 0.3s ease-out;
}
.search-layer-enter {
  opacity: 0;
}
.search-layer-leave-active {
  opacity: 0;
}

.search-result-enter-active {
  transition: all 0.2s ease 0.1s;
}
.search-result-leave-active {
  transition: all 0.2s ease 0.1s;
}
.search-result-enter {
  opacity: 0;
  transform: translate3d(0, 30px, 0);
}
.search-result-leave-active {
  opacity: 0;
  transform: translate3d(0, 30px, 0);
}
// 轻应用
.light-list-item {
  display: flex;
  align-items: center;
  .px2rem(height, 112);
  // .px2rem(width, 718);
  padding-right: 0;
  .px2rem(margin-left, 32);
  align-items: center;
  .schema-icon {
    color: #107fff;
  }
  .schema-name {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 100%;
    .px2rem(line-height, 112);
    .px2rem(padding-right, 20);
    .px2rem(font-size, 30);
    color: #333;
    padding-left: 0.45333333rem;
    span {
      .px2rem(font-size, 30);
    }
  }
  .ellipsis-o {
    transform: rotateZ(90deg);
    padding: 0.6rem 0.4rem;
    margin-left: auto;
    &::before {
      color: #b4b7bc;
      .px2rem(font-size, 48);
    }
  }
}
.form-op-box {
  .form-op {
    &__item {
      .px2rem(height, 112);
      .px2rem(font-size, 30);
      .px2rem(line-height, 112);
      text-align: center;
      background: #fff;
      &:first-child {
        box-shadow: 0 0.12rem 0.9866666rem 0 rgba(0, 115, 233, 0.03);
        border-radius: 0.213333rem 0.213333rem 0 0;
      }
    }
    &__item-delete {
      color: #ef503e;
    }
    &__item-cancel {
      .px2rem(margin-top, 21);
      border-bottom: none !important;
    }
  }
}
// 轻应用
.setting-dropdown-menu {
  position: relative;
  z-index: 10001;
}
.setting-dropdown-menu {
  .h3ui-actionsheet__cell {
    .px2rem(height, 112);
    .px2rem(font-size, 30);
    .px2rem(line-height, 112);
    background: #fff;
  }
  .h3ui-actionsheet {
    border-radius: 0.213333rem 0.213333rem 0 0 !important;
    // 处理iphoneX适配问题
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .h3ui-actionsheet__menu {
      border-radius: 0.213333rem 0.213333rem 0 0 !important;
      overflow: hidden;
    }
  }
  .h3-actionsheet-menu-default {
    &:first-child {
      box-shadow: 0 0.12rem 0.9866666rem 0 rgba(0, 115, 233, 0.03);
    }
  }
  .h3ui-actionsheet__action {
    .px2rem(margin-top, 21);

    .h3ui-actionsheet__cell {
      &::before {
        background: none !important;
      }
    }
  }
  .h3ui-actionsheet-cancel-button-mask {
    background-color: #f5f7f9;
  }
}
@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
</style>

