<template>
  <layout
    :showHeader="false"
    title="公开查询"
  >
    <div v-if="enabled" class="open-query">
      <div class="open-query__header">
        <query-title :title="title" :themeIndex="themeIndex" />
        <query-desc
          v-if="description.length > 0"
          :desc="description"
          @ready="ready"
          @toggle="toggle"
        />
      </div>
      <div v-show="isReady" class="open-query__body">
        <query-validate
          v-if="pwdVisible"
          class="open-query__validate"
          @validate="validate"
          @change="onPasswordChange"
        />
        <query-body
          v-if="!pwdVisible"
          v-show="!isSearchMode"
          :columns="conditions"
          :controls="queryControlsMap"
          @change="setFilterValue"
        />
        <query-result
          v-if="isSearchMode"
          :searchParams="searchParams"
          :schemaCode="schemaCode"
          :columns="tableColumns"
          @invalid="enabled = false"
        />
      </div>
      <div v-if="!pwdVisible" class="open-query__bottom" :class="{'no-bg': !isSearchMode}">
        <div class="open-query__button" :class="{inactive: !isSearchMode && !canSearch}" @click="handler">
          {{ btnText }}
        </div>
      </div>
      <transition name="error">
        <div v-if="!validSuccess" class="open-query__error">
          密码错误，请重新输入
        </div>
      </transition>
    </div>
    <div v-if="!enabled" class="invalid-page">
      <div>
        <img src="../../../assets/img/invalid.png" />
        <span>链接已失效</span>
      </div>
    </div>
  </layout>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';
import trim from 'lodash/trim';
import { getPublicOpenQuerySetting, getQueryColumns, validQueryPassword } from '@/light-app/service/external';
import { setLeft, closeApp } from '@/config/dingtalk-interface';
import { isDingtalk } from '@/config/common';
import { H3Toast } from '@h3/thinking-ui';
import { FormControlType } from '@/light-app/config/form-control-type';
import QueryTitle from './query-title.vue';
import QueryDesc from './query-desc.vue';
import QueryValidate from './query-validate.vue';
import QueryBody from './query-body.vue';
import QueryResult from './query-result.vue';
Vue.use(H3Toast);

const CookiePrefix = 'OpenQueryValid_';

@Component({
  name: 'open-query',
  components: {
    QueryTitle,
    QueryDesc,
    QueryValidate,
    QueryBody,
    QueryResult,
  },
})
export default class OpenQuery extends Vue {
  loading = false;

  title = '';

  enabled = true;

  description = '';

  themeIndex = 0;

  openLevel = 0;

  conditions = [];

  schemaCode = '';

  validSuccess = -1;

  tableColumns = [];

  queryControlsMap = {};

  isSearchMode = false;

  searchParams = {};

  isReady = false; // 解决移动端头部描述说明宽度发生变化后导致的flex：1 的内容被往下挤压的问题

  queryValueMap = {};

  get canSearch () {
    const keys = Object.keys(this.queryValueMap);
    if (keys.length !== this.conditions.length) {
      return false;
    }
    for (const key of keys) {
      if (!trim(this.queryValueMap[key])) {
        return false;
      }
    }
    return true;
  }

  get pwdVisible () {
    if (this.openLevel === 0) {
      return false;
    }
    if (this.validSuccess === 1) {
      return false;
    }
    const cookieValue = this.getCookie(`${CookiePrefix}${this.schemaCode}`);
    if (cookieValue && cookieValue === '1') {
      return false;
    }
    return true;
  }

  get showHeader () {
    return !isDingtalk;
  }

  get btnText () {
    if (!this.isSearchMode) {
      return '查询';
    }
    return '修改查询条件';
  }

  mounted () {
    this.schemaCode = this.$route.params.schemaCode as string;
    this.init();
  }

  activated () {
    if (isDingtalk) {
      setLeft(() => {
        closeApp();
      });
    }
  }

  ready () {
    this.isReady = true;
  }

  setFilterValue (val) {
    this.queryValueMap = val;
  }

  toggle () {
    this.isReady = false;
    setTimeout(() => {
      this.isReady = true;
    }, 0);
  }

  handler () {
    // 如果是灰色则不可点击
    if (!this.isSearchMode && !this.canSearch) {
      return;
    }
    this.isSearchMode = !this.isSearchMode;
    if (this.isSearchMode) {
      this.searchParams = this.queryValueMap;
    }
  }

  controlsAcl = {};

  async init () {
    this.loading = true;
    const ret = await getPublicOpenQuerySetting(this.schemaCode);
    if (ret.success) {
      const setting = ret.returnData.Setting;
      this.enabled = setting.status !== 0;
      this.title = setting.title;
      this.description = setting.description;
      this.isReady = this.description.length === 0;
      this.themeIndex = Number(`${setting.themeStyle || 0}`);
      const { accessLevel, queryColumns } = setting.extAttr;
      this.openLevel = accessLevel || 0;
      this.conditions = queryColumns || [];
      if (setting.controlsAcl) {
        try {
          this.controlsAcl = JSON.parse(setting.controlsAcl);
        } catch (e) {}
      }
      getQueryColumns(this.schemaCode).then((datas) => {
        // 根据字段的查看权限修改显示字段
        const columns = datas.returnData.columns;
        this.tableColumns = this.getTableColumns(columns);
        // this.updateTableColumnsVisible();
        this.queryControlsMap = this.setControlsMap();
        this.loading = false;
      });
    } else {
      this.loading = false;
      // this.$toast.show({ icon: 'close-circle-o', text: ret.errorMsg });
      this.enabled = false;
    }
  }

  getTableColumns (columns) {
    const ret = columns.filter(col => (col.colType !== FormControlType.FormMultiUser &&
      col.colType !== FormControlType.FormUser &&
      col.colType !== FormControlType.FormCreater &&
      col.colType !== FormControlType.FormOwner &&
      col.colType !== FormControlType.FormDepartment &&
      col.colType !== FormControlType.FormMultiDepartment &&
      col.colType !== FormControlType.FormCreatedTime &&
      col.colType !== FormControlType.FormModifiedTime
    ));
    return ret;
  }

  setControlsMap () {
    const ret = {};
    this.tableColumns.forEach((col) => {
      // 如果是日期，日期格式只支持年月日
      if ((col.colType !== FormControlType.FormDateTime) ||
        (col.colType === FormControlType.FormDateTime && col.controlOptions.DateTimeMode === 'yyyy-mm-dd')
      ) {
        ret[col.code] = {
          dataField: col.code,
          controlKey: FormControlType[col.colType],
          displayName: col.displayName,
          options: col.controlOptions,
        };
      }
    });
    return ret;
  }

  // 更新查询字段显示权限
  updateTableColumnsVisible () {
    const keys = Object.keys(this.controlsAcl);
    this.tableColumns.forEach((col) => {
      const ctrl = this.controlsAcl[col.code];
      if (ctrl) {
        col.visibility = ctrl.Visible;
      } else {
        if (keys.length > 0) {
          col.visibility = false;
        }
      }
    });
  }

  async validate (pwd: string) {
    const ret = await validQueryPassword(this.schemaCode, pwd);
    if (ret.success) {
      this.validSuccess = 1;
    } else {
      this.validSuccess = 0;
    }
  }

  // search (searchParams: any) {
  //   this.searchParams = searchParams;
  //   this.isSearchMode = true;
  // }

  // back () {
  //   this.isSearchMode = false;
  // }

  onPasswordChange () {
    if (this.validSuccess === 0) {
      this.validSuccess = -1;
    }
  }

  getCookie (key: string): string {
    const reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
    const arr = document.cookie.match(reg);
    if (arr) {
      return unescape(arr[2]);
    }
  }
}

</script>

<style lang="less" scoped>
@baseFontSize: 75;

.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.open-query {
  display: flex;
  flex-direction: column;
  height: 100%;
  &__body {
    position: relative;
    flex: 1;
  }
  &__error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .px2rem(height, 72);
    .px2rem(line-height, 72);
    .px2rem(padding-left, 30);
    .px2rem(font-size, 28);
    background:rgba(255,240,243,1);
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(255,67,132,1);
    z-index: 101;
  }
  .error-enter-active, .error-leave-active {
    transition: all .5s
  }
  &__bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    .px2rem(height, 148);
    display: flex;
    justify-content: center;
    align-items: center;
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
    background:#fff;
    &.no-bg {
      background: transparent;
    }
  }
  &__button {
    width: 100%;
    .px2rem(height, 88);
    .px2rem(line-height, 88);
    background:rgba(16,127,255,1);
    .px2rem(border-radius, 44);
    color: #fff;
    text-align: center;
    .px2rem(font-size, 30);
    &.inactive {
      color:rgba(204,204,204,1);
      background:rgba(235,237,242,1);
    }
  }
}
.invalid-page{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  img {
    .px2rem(width, 200);
    .px2rem(height, 200);
    .px2rem(margin-bottom, 24);
  }
  span {
    .px2rem(font-size, 28);
    font-family:PingFangSC-Regular,PingFang SC;
    color:rgba(153,153,153,1);
  }
}

</style>
